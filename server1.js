const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(express.static(path.join(__dirname, 'public')));

// Standard Polyomino shapes matching [[dx, dy]] coordinates
const SHAPE_DEFINITIONS = [
  [[0, 0]],
  [[0, 0], [1, 0]],
  [[0, 0], [1, 0], [2, 0]],
  [[0, 0], [1, 0], [2, 0], [3, 0]],
  [[0, 0], [1, 0], [0, 1], [1, 1]],
  [[0, 0], [0, 1], [1, 1]],
  [[1, 0], [0, 1], [1, 1]],
  [[0, 0], [1, 0], [2, 0], [1, 1]],
  [[0, 0], [1, 0], [2, 0], [0, 1]],
  [[0, 0], [1, 0], [2, 0], [2, 1]]
];

let pieceSeq = 1;
function generatePiece() {
  const cells = SHAPE_DEFINITIONS[Math.floor(Math.random() * SHAPE_DEFINITIONS.length)];
  return {
    id: 'pc_' + (pieceSeq++),
    cells: cells
  };
}

function generateRack() {
  return [generatePiece(), generatePiece(), generatePiece()];
}

function canFitAnywhere(grid, rack) {
  for (const piece of rack) {
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const fits = piece.cells.every(([dx, dy]) => {
          const nx = x + dx;
          const ny = y + dy;
          return nx < 8 && ny < 8 && grid[ny][nx] === 0;
        });
        if (fits) return true;
      }
    }
  }
  return false;
}

const rooms = {};
const roomTickers = new Map();
const disconnectTimers = new Map();

function getPublicState(room) {
  return {
    roomId: room.roomId,
    status: room.status,
    hostSeat: room.hostSeat,
    targetScore: room.targetScore,
    matchDuration: room.matchDuration,
    remaining: room.remaining,
    winnerSeat: room.winnerSeat,
    reason: room.reason,
    revision: room.revision++,
    action: room.action || null,
    players: room.players.map(p => ({
      seat: p.seat,
      name: p.name,
      score: p.score,
      grid: p.grid,
      rack: p.rack,
      blocked: p.blocked,
      connected: p.connected
    }))
  };
}

function emitRoomState(room) {
  io.to(room.roomId).emit('room_state', getPublicState(room));
}

function stopRoomTimer(roomId) {
  if (roomTickers.has(roomId)) {
    clearInterval(roomTickers.get(roomId));
    roomTickers.delete(roomId);
  }
}

function startRoomTimer(room) {
  stopRoomTimer(room.roomId);
  room.remaining = room.matchDuration;

  const ticker = setInterval(() => {
    if (room.status !== 'playing') {
      stopRoomTimer(room.roomId);
      return;
    }

    room.remaining--;
    io.to(room.roomId).emit('timer_tick', { remaining: room.remaining });

    if (room.remaining <= 0) {
      stopRoomTimer(room.roomId);
      room.status = 'finished';
      room.reason = 'time';
      if (room.players.length === 2) {
        if (room.players[0].score > room.players[1].score) room.winnerSeat = room.players[0].seat;
        else if (room.players[1].score > room.players[0].score) room.winnerSeat = room.players[1].seat;
        else room.winnerSeat = null;
      }
      emitRoomState(room);
    }
  }, 1000);

  roomTickers.set(room.roomId, ticker);
}

io.on('connection', (socket) => {
  socket.on('join_room', (data = {}, callback) => {
    let { roomId, playerName, playerId } = data;
    roomId = (roomId || '').trim().toUpperCase();

    if (!roomId || !playerName) {
      return callback?.({ error: 'INVALID_INPUT' });
    }

    const pId = playerId || 'p_' + Math.random().toString(36).substring(2, 9);
    socket.roomId = roomId;
    socket.playerId = pId;
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = {
        roomId,
        status: 'waiting',
        hostSeat: 0,
        targetScore: 1200,
        matchDuration: 180,
        remaining: 180,
        winnerSeat: null,
        reason: null,
        revision: 1,
        players: []
      };
    }

    const room = rooms[roomId];
    let player = room.players.find(p => p.id === pId);

    if (player) {
      player.socketId = socket.id;
      player.connected = true;
      player.name = playerName;
      if (disconnectTimers.has(pId)) {
        clearTimeout(disconnectTimers.get(pId));
        disconnectTimers.delete(pId);
      }
    } else {
      if (room.players.length >= 2) {
        return callback?.({ error: 'ROOM_FULL' });
      }
      if (room.status === 'playing') {
        return callback?.({ error: 'MATCH_ACTIVE' });
      }

      const assignedSeat = room.players.some(p => p.seat === 0) ? 1 : 0;
      player = {
        id: pId,
        socketId: socket.id,
        seat: assignedSeat,
        name: playerName,
        score: 0,
        grid: Array(8).fill(null).map(() => Array(8).fill(0)),
        rack: generateRack(),
        blocked: false,
        connected: true
      };
      room.players.push(player);
      room.players.sort((a, b) => a.seat - b.seat);
    }

    callback?.({ ok: true, playerId: pId, seat: player.seat });
    emitRoomState(room);
  });

  socket.on('configure', ({ targetScore, matchDuration }, callback) => {
    const room = rooms[socket.roomId];
    const player = room?.players.find(p => p.id === socket.playerId);
    if (!room || player?.seat !== room.hostSeat) return callback?.({ error: 'HOST_ONLY' });

    room.targetScore = Math.max(100, Math.min(100000, Number(targetScore) || 1200));
    room.matchDuration = Math.max(30, Math.min(3600, Number(matchDuration) || 180));
    room.remaining = room.matchDuration;

    callback?.({ ok: true });
    emitRoomState(room);
  });

  socket.on('start_match', (_, callback) => {
    const room = rooms[socket.roomId];
    const player = room?.players.find(p => p.id === socket.playerId);
    if (!room || player?.seat !== room.hostSeat) return callback?.({ error: 'HOST_ONLY' });
    if (room.players.length !== 2 || room.players.some(p => !p.connected)) {
      return callback?.({ error: 'NEED_TWO' });
    }

    room.status = 'playing';
    room.winnerSeat = null;
    room.reason = null;
    room.remaining = room.matchDuration;

    room.players.forEach(p => {
      p.score = 0;
      p.grid = Array(8).fill(null).map(() => Array(8).fill(0));
      p.rack = generateRack();
      p.blocked = false;
    });

    startRoomTimer(room);
    callback?.({ ok: true });
    emitRoomState(room);
  });

  socket.on('place_piece', ({ pieceId, x, y }, callback) => {
    const room = rooms[socket.roomId];
    if (!room || room.status !== 'playing') return callback?.({ error: 'NOT_PLAYING' });

    const player = room.players.find(p => p.id === socket.playerId);
    if (!player || player.blocked) return callback?.({ error: 'INVALID_PLACEMENT' });

    const pieceIdx = player.rack.findIndex(p => p.id === pieceId);
    if (pieceIdx === -1) return callback?.({ error: 'INVALID_PLACEMENT' });

    const piece = player.rack[pieceIdx];

    // Check boundary & overlap
    const valid = piece.cells.every(([dx, dy]) => {
      const nx = x + dx;
      const ny = y + dy;
      return nx < 8 && ny < 8 && player.grid[ny][nx] === 0;
    });

    if (!valid) return callback?.({ error: 'INVALID_PLACEMENT' });

    // Place blocks
    piece.cells.forEach(([dx, dy]) => {
      player.grid[y + dy][x + dx] = 1;
    });
    player.score += piece.cells.length * 10;
    player.rack.splice(pieceIdx, 1);

    // Blast lines
    const fullRows = [];
    const fullCols = [];
    for (let r = 0; r < 8; r++) {
      if (player.grid[r].every(v => v === 1)) fullRows.push(r);
    }
    for (let c = 0; c < 8; c++) {
      let colFull = true;
      for (let r = 0; r < 8; r++) {
        if (player.grid[r][c] === 0) colFull = false;
      }
      if (colFull) fullCols.push(c);
    }

    const lines = fullRows.length + fullCols.length;
    if (lines > 0) {
      fullRows.forEach(r => { for (let c = 0; c < 8; c++) player.grid[r][c] = 0; });
      fullCols.forEach(c => { for (let r = 0; r < 8; r++) player.grid[r][c] = 0; });
      player.score += lines * 100 * lines;
    }

    if (player.rack.length === 0) {
      player.rack = generateRack();
    }

    player.blocked = !canFitAnywhere(player.grid, player.rack);

    room.action = { seat: player.seat, lines };

    // Win condition: Target score reached
    if (player.score >= room.targetScore) {
      room.status = 'finished';
      room.winnerSeat = player.seat;
      room.reason = 'target';
      stopRoomTimer(room.roomId);
    } else if (room.players.every(p => p.blocked)) {
      // Win condition: Both players blocked
      room.status = 'finished';
      room.reason = 'blocked';
      if (room.players[0].score > room.players[1].score) room.winnerSeat = room.players[0].seat;
      else if (room.players[1].score > room.players[0].score) room.winnerSeat = room.players[1].seat;
      else room.winnerSeat = null;
      stopRoomTimer(room.roomId);
    }

    callback?.({ ok: true });
    emitRoomState(room);
  });

  socket.on('leave_room', (_, callback) => {
    const room = rooms[socket.roomId];
    if (room && socket.playerId) {
      room.players = room.players.filter(p => p.id !== socket.playerId);
      if (room.players.length === 0) {
        stopRoomTimer(room.roomId);
        delete rooms[room.roomId];
      } else {
        room.hostSeat = room.players[0].seat;
        emitRoomState(room);
      }
    }
    socket.leave(socket.roomId);
    socket.roomId = null;
    callback?.({ ok: true });
  });

  socket.on('disconnect', () => {
    const room = rooms[socket.roomId];
    if (!room) return;

    const player = room.players.find(p => p.id === socket.playerId);
    if (!player) return;

    player.connected = false;

    const timer = setTimeout(() => {
      if (!player.connected) {
        room.players = room.players.filter(p => p.id !== socket.playerId);
        if (room.players.length === 0) {
          stopRoomTimer(room.roomId);
          delete rooms[room.roomId];
        } else {
          room.hostSeat = room.players[0].seat;
          if (room.status === 'playing') {
            room.status = 'finished';
            room.winnerSeat = room.players[0].seat;
            room.reason = 'disconnect';
            stopRoomTimer(room.roomId);
          }
          emitRoomState(room);
        }
      }
    }, 60000);

    disconnectTimers.set(socket.playerId, timer);
    emitRoomState(room);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => console.log(`Block Blaster Duel listening on port ${PORT}`));