const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);

// Allow cross-origin requests & ensure websocket/polling fallback works smoothly on Render
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  transports: ['websocket', 'polling']
});

app.use(express.static(path.join(__dirname, 'public')));

// Polyomino pieces catalog
const SHAPES = [
  [[1]],
  [[1, 1]],
  [[1, 1, 1]],
  [[1, 1, 1, 1]],
  [[1, 1], [1, 1]],
  [[1, 0], [1, 1]],
  [[0, 1], [1, 1]],
  [[1, 1, 1], [0, 1, 0]],
  [[1, 1, 1], [1, 0, 0]],
  [[1, 1, 1], [0, 0, 1]]
];

function generateRack() {
  return [
    SHAPES[Math.floor(Math.random() * SHAPES.length)],
    SHAPES[Math.floor(Math.random() * SHAPES.length)],
    SHAPES[Math.floor(Math.random() * SHAPES.length)]
  ];
}

const DISCONNECT_GRACE_PERIOD = 60000;
const rooms = {};

const disconnectTimers = new Map();
const roomTickers = new Map();

function checkWinCondition(room, player) {
  if (!room.winner && player.score >= room.targetScore) {
    room.winner = player.name;
    room.started = false;
    stopRoomTimer(room.roomId);
  }
}

function clearPlayerTimer(playerId) {
  if (disconnectTimers.has(playerId)) {
    clearTimeout(disconnectTimers.get(playerId));
    disconnectTimers.delete(playerId);
  }
}

function startRoomTimer(room) {
  stopRoomTimer(room.roomId);
  room.timeLeft = room.matchDuration;

  const ticker = setInterval(() => {
    if (!room.started || room.winner) {
      stopRoomTimer(room.roomId);
      return;
    }

    room.timeLeft--;
    io.to(room.roomId).emit('timer_tick', { timeLeft: room.timeLeft });

    if (room.timeLeft <= 0) {
      let highest = null;
      Object.values(room.players).forEach(p => {
        if (!highest || p.score > highest.score) highest = p;
      });
      room.winner = highest ? highest.name : 'Draw';
      room.started = false;
      stopRoomTimer(room.roomId);
      io.to(room.roomId).emit('room_update', sanitizeRoom(room));
    }
  }, 1000);

  roomTickers.set(room.roomId, ticker);
}

function stopRoomTimer(roomId) {
  if (roomTickers.has(roomId)) {
    clearInterval(roomTickers.get(roomId));
    roomTickers.delete(roomId);
  }
}

function removePlayerFromRoom(room, playerId) {
  clearPlayerTimer(playerId);
  const player = room.players[playerId];
  if (!player) return;

  delete room.players[playerId];

  if (Object.keys(room.players).length === 0) {
    stopRoomTimer(room.roomId);
    delete rooms[room.roomId];
  } else {
    if (room.hostId === playerId) {
      room.hostId = Object.keys(room.players)[0];
    }

    if (room.started && !room.winner) {
      const remaining = Object.values(room.players).filter(p => p.connected);
      if (remaining.length === 1) {
        room.winner = remaining[0].name;
        room.started = false;
        stopRoomTimer(room.roomId);
      }
    }

    io.to(room.roomId).emit('room_update', sanitizeRoom(room));
  }
}

io.on('connection', (socket) => {
  // Support both object payloads and ack callbacks
  socket.on('join_room', (data = {}, ack) => {
    let { roomId, playerName, playerId } = data;
    roomId = (roomId || '').trim().toUpperCase();

    const sendError = (msg) => {
      socket.emit('error_msg', msg);
      socket.emit('join_error', { message: msg });
      if (typeof ack === 'function') ack({ success: false, error: msg });
    };

    if (!roomId) {
      return sendError('Please provide a valid room code.');
    }

    const pId = playerId || 'p_' + Math.random().toString(36).substring(2, 9);
    socket.join(roomId);
    socket.roomId = roomId;
    socket.playerId = pId;

    if (!rooms[roomId]) {
      rooms[roomId] = {
        roomId,
        hostId: pId,
        started: false,
        round: 1,
        targetScore: 1200,
        matchDuration: 180,
        timeLeft: 180,
        winner: null,
        players: {}
      };
    }

    const room = rooms[roomId];

    if (room.players[pId]) {
      const existing = room.players[pId];
      existing.socketId = socket.id;
      existing.connected = true;
      clearPlayerTimer(pId);
      if (playerName) existing.name = playerName;
    } else {
      if (room.started) {
        return sendError('Game is already running.');
      }

      const activeCount = Object.keys(room.players).length;
      if (activeCount >= 2) {
        return sendError('Room is currently full (Max 2 players).');
      }

      const assignedRole = Object.values(room.players).some(p => p.role === 'p1') ? 'p2' : 'p1';

      room.players[pId] = {
        id: pId,
        socketId: socket.id,
        name: playerName || (assignedRole === 'p1' ? 'Player 1' : 'Player 2'),
        role: assignedRole,
        score: 0,
        board: Array(8).fill(null).map(() => Array(8).fill(0)),
        rack: generateRack(),
        ready: false,
        connected: true,
        lastReport: null
      };
    }

    const safeRoom = sanitizeRoom(room);

    // Fire all possible confirmation patterns expected by frontend clients
    socket.emit('session_created', { playerId: pId, roomId, room: safeRoom });
    socket.emit('join_success', { playerId: pId, roomId, room: safeRoom });
    io.to(roomId).emit('room_update', safeRoom);

    // Invoke client-side callback if the frontend uses a Promise/ack
    if (typeof ack === 'function') {
      ack({ success: true, playerId: pId, roomId, room: safeRoom });
    }
  });

  socket.on('update_room_settings', ({ targetScore, matchDuration } = {}) => {
    const room = rooms[socket.roomId];
    if (!room || room.hostId !== socket.playerId || room.started) return;

    room.targetScore = Math.max(300, Number(targetScore) || 1200);
    room.matchDuration = Math.min(600, Math.max(30, Number(matchDuration) || 180));
    room.timeLeft = room.matchDuration;

    io.to(room.roomId).emit('room_update', sanitizeRoom(room));
  });

  socket.on('start_game', () => {
    const room = rooms[socket.roomId];
    if (!room || room.hostId !== socket.playerId) return;

    const activePlayers = Object.values(room.players).filter(p => p.connected);
    if (activePlayers.length < 1) {
      socket.emit('error_msg', 'Need at least 1 player to start.');
      return;
    }

    room.started = true;
    room.winner = null;
    room.timeLeft = Number(room.matchDuration) || 180;

    Object.values(room.players).forEach(p => {
      p.score = 0;
      p.board = Array(8).fill(null).map(() => Array(8).fill(0));
      p.rack = generateRack();
      p.ready = false;
      p.lastReport = null;
    });

    startRoomTimer(room);
    io.to(room.roomId).emit('room_update', sanitizeRoom(room));
  });

  socket.on('place_piece', ({ pieceIndex, row, col } = {}) => {
    const room = rooms[socket.roomId];
    if (!room || !room.started || room.winner) return;

    const player = room.players[socket.playerId];
    if (!player) return;

    const shape = player.rack[pieceIndex];
    if (!shape) return;

    // Bounds & Collision Validation
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[0].length; c++) {
        if (shape[r][c] === 1) {
          const tr = row + r;
          const tc = col + c;
          if (tr >= 8 || tc >= 8 || player.board[tr][tc] === 1) return;
        }
      }
    }

    let placedBlocks = 0;
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[0].length; c++) {
        if (shape[r][c] === 1) {
          player.board[row + r][col + c] = 1;
          placedBlocks++;
        }
      }
    }

    player.score += placedBlocks * 10;
    player.rack[pieceIndex] = null;

    // Simultaneous row & column blast detection
    const fullRows = [];
    const fullCols = [];

    for (let r = 0; r < 8; r++) {
      if (player.board[r].every(v => v === 1)) fullRows.push(r);
    }
    for (let c = 0; c < 8; c++) {
      let full = true;
      for (let r = 0; r < 8; r++) {
        if (player.board[r][c] === 0) full = false;
      }
      if (full) fullCols.push(c);
    }

    const linesCleared = fullRows.length + fullCols.length;
    if (linesCleared > 0) {
      fullRows.forEach(r => { for (let c = 0; c < 8; c++) player.board[r][c] = 0; });
      fullCols.forEach(c => { for (let r = 0; r < 8; r++) player.board[r][c] = 0; });
      player.score += linesCleared * 100 * linesCleared;
    }

    if (player.rack.every(p => p === null)) {
      player.rack = generateRack();
    }

    player.lastReport = {
      placedBlocks,
      linesCleared,
      scoreGained: (placedBlocks * 10) + (linesCleared > 0 ? (linesCleared * 100 * linesCleared) : 0)
    };

    checkWinCondition(room, player);
    io.to(room.roomId).emit('room_update', sanitizeRoom(room));
  });

  socket.on('leave_room', () => {
    const room = rooms[socket.roomId];
    if (!room || !socket.playerId) return;
    socket.leave(room.roomId);
    removePlayerFromRoom(room, socket.playerId);
    socket.roomId = null;
    socket.playerId = null;
    socket.emit('left_room_success');
  });

  socket.on('disconnect', () => {
    const room = rooms[socket.roomId];
    if (!room || !socket.playerId) return;

    const player = room.players[socket.playerId];
    if (!player || player.socketId !== socket.id) return;

    player.connected = false;

    clearPlayerTimer(socket.playerId);
    const timer = setTimeout(() => {
      removePlayerFromRoom(room, socket.playerId);
    }, DISCONNECT_GRACE_PERIOD);

    disconnectTimers.set(socket.playerId, timer);
    io.to(room.roomId).emit('room_update', sanitizeRoom(room));
  });
});

function sanitizeRoom(room) {
  const safePlayers = {};
  for (const id in room.players) {
    const p = room.players[id];
    safePlayers[id] = {
      id: p.id,
      name: p.name,
      role: p.role,
      score: p.score,
      board: p.board,
      rack: p.rack,
      ready: p.ready,
      connected: p.connected,
      lastReport: p.lastReport
    };
  }

  return {
    roomId: room.roomId,
    hostId: room.hostId,
    started: room.started,
    round: room.round,
    targetScore: room.targetScore,
    matchDuration: Number(room.matchDuration) || 180,
    timeLeft: typeof room.timeLeft === 'number' ? room.timeLeft : (Number(room.matchDuration) || 180),
    winner: room.winner || null,
    players: safePlayers
  };
}

// Ensure 0.0.0.0 host binding for cloud containers like Render
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Block Blaster Duel active on port ${PORT}`);
});