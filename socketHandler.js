'use strict';

/**
 * ============================================================================
 * SOCKET EVENT HANDLERS
 * ============================================================================
 */

const { generateRack, canFitAnywhere } = require('./gameLogic');

const MAX_PLAYERS = 10;

function registerSocketHandlers(io, roomManager) {
  const {
    rooms,
    disconnectTimers,
    emitRoomState,
    stopRoomTimer,
    startRoomTimer
  } = roomManager;

  io.on('connection', (socket) => {
    // ------------------------------------------------------------------------
    // 1. Join / Create Room
    // ------------------------------------------------------------------------
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
          gameMode: 'timed',
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
      let player = room.players.find((p) => p.id === pId);

      if (player) {
        player.socketId = socket.id;
        player.connected = true;
        player.name = playerName;
        if (disconnectTimers.has(pId)) {
          clearTimeout(disconnectTimers.get(pId));
          disconnectTimers.delete(pId);
        }
      } else {
        if (room.players.length >= MAX_PLAYERS) {
          return callback?.({ error: 'ROOM_FULL' });
        }
        if (room.status === 'playing') {
          return callback?.({ error: 'MATCH_ACTIVE' });
        }

        // Allocate lowest available seat index
        const takenSeats = new Set(room.players.map((p) => p.seat));
        let assignedSeat = 0;
        while (takenSeats.has(assignedSeat)) assignedSeat++;

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

    // ------------------------------------------------------------------------
    // 2. Configure Rules (Host Only - Auto-Save supported)
    // ------------------------------------------------------------------------
    socket.on('configure', ({ targetScore, matchDuration, gameMode }, callback) => {
      const room = rooms[socket.roomId];
      const player = room?.players.find((p) => p.id === socket.playerId);
      if (!room || player?.seat !== room.hostSeat) return callback?.({ error: 'HOST_ONLY' });

      if (gameMode === 'endless' || gameMode === 'timed') {
        room.gameMode = gameMode;
      }
      if (targetScore !== undefined) {
        room.targetScore = Math.max(100, Math.min(100000, Number(targetScore) || 1200));
      }
      if (matchDuration !== undefined) {
        room.matchDuration = Math.max(30, Math.min(3600, Number(matchDuration) || 180));
        if (room.status !== 'playing' && room.gameMode === 'timed') {
          room.remaining = room.matchDuration;
        }
      }

      callback?.({ ok: true });
      emitRoomState(room);
    });

    // ------------------------------------------------------------------------
    // 3. Start Match (Host Only)
    // ------------------------------------------------------------------------
    socket.on('start_match', (_, callback) => {
      const room = rooms[socket.roomId];
      const player = room?.players.find((p) => p.id === socket.playerId);
      if (!room || player?.seat !== room.hostSeat) return callback?.({ error: 'HOST_ONLY' });

      // Allow starting with 1 or more connected players
      if (room.players.length < 1 || room.players.some((p) => !p.connected)) {
        return callback?.({ error: 'NEED_TWO' });
      }

      room.status = 'playing';
      room.winnerSeat = null;
      room.reason = null;
      room.remaining = room.gameMode === 'endless' ? 0 : room.matchDuration;

      room.players.forEach((p) => {
        p.score = 0;
        p.grid = Array(8).fill(null).map(() => Array(8).fill(0));
        p.rack = generateRack();
        p.blocked = false;
      });

      startRoomTimer(room);
      callback?.({ ok: true });
      emitRoomState(room);
    });

    // ------------------------------------------------------------------------
    // 4. Place Piece & Line Blast
    // ------------------------------------------------------------------------
    socket.on('place_piece', ({ pieceId, x, y }, callback) => {
      const room = rooms[socket.roomId];
      if (!room || room.status !== 'playing') return callback?.({ error: 'NOT_PLAYING' });

      const player = room.players.find((p) => p.id === socket.playerId);
      if (!player || player.blocked) return callback?.({ error: 'INVALID_PLACEMENT' });

      const pieceIdx = player.rack.findIndex((p) => p.id === pieceId);
      if (pieceIdx === -1) return callback?.({ error: 'INVALID_PLACEMENT' });

      const piece = player.rack[pieceIdx];

      // Check boundary & overlap
      const valid = piece.cells.every(([dx, dy]) => {
        const nx = x + dx;
        const ny = y + dy;
        return nx < 8 && ny < 8 && player.grid[ny][nx] === 0;
      });

      if (!valid) return callback?.({ error: 'INVALID_PLACEMENT' });

      // Place blocks on grid
      piece.cells.forEach(([dx, dy]) => {
        player.grid[y + dy][x + dx] = 1;
      });
      player.score += piece.cells.length * 10;
      player.rack.splice(pieceIdx, 1);

      // Check and blast complete lines (rows and columns)
      const fullRows = [];
      const fullCols = [];
      for (let r = 0; r < 8; r++) {
        if (player.grid[r].every((v) => v === 1)) fullRows.push(r);
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
        fullRows.forEach((r) => {
          for (let c = 0; c < 8; c++) player.grid[r][c] = 0;
        });
        fullCols.forEach((c) => {
          for (let r = 0; r < 8; r++) player.grid[r][c] = 0;
        });
        player.score += lines * 100 * lines;
      }

      // Replenish rack if empty
      if (player.rack.length === 0) {
        player.rack = generateRack();
      }

      // Check if player has valid moves remaining
      player.blocked = !canFitAnywhere(player.grid, player.rack);

      room.action = { seat: player.seat, lines };

      // Win Condition Checks
      if (room.gameMode === 'timed') {
        // Timed Mode: Target score reached
        if (player.score >= room.targetScore) {
          room.status = 'finished';
          room.winnerSeat = player.seat;
          room.reason = 'target';
          stopRoomTimer(room.roomId);
        } else if (room.players.every((p) => p.blocked)) {
          // All players blocked
          room.status = 'finished';
          room.reason = 'blocked';
          const sorted = [...room.players].sort((a, b) => b.score - a.score);
          if (sorted.length === 1 || sorted[0].score > sorted[1].score) {
            room.winnerSeat = sorted[0].seat;
          } else {
            room.winnerSeat = null;
          }
          stopRoomTimer(room.roomId);
        }
      } else {
        // Endless Mode: No target cap. If all players become blocked, conclude match
        if (room.players.every((p) => p.blocked)) {
          room.status = 'finished';
          room.reason = 'blocked';
          const sorted = [...room.players].sort((a, b) => b.score - a.score);
          if (sorted.length === 1 || sorted[0].score > sorted[1].score) {
            room.winnerSeat = sorted[0].seat;
          } else {
            room.winnerSeat = null;
          }
          stopRoomTimer(room.roomId);
        }
      }

      callback?.({ ok: true });
      emitRoomState(room);
    });

    // ------------------------------------------------------------------------
    // 5. Reset Field (Score, Grid, Rack)
    // ------------------------------------------------------------------------
    socket.on('reset_field', (_, callback) => {
      const room = rooms[socket.roomId];
      if (!room || room.status !== 'playing') {
        return callback?.({ error: 'NOT_PLAYING' });
      }

      const player = room.players.find((p) => p.id === socket.playerId);
      if (!player) {
        return callback?.({ error: 'NO_ROOM' });
      }

      // Reset score, grid, rack, and blocked status for this player
      player.score = 0;
      player.grid = Array(8).fill(null).map(() => Array(8).fill(0));
      player.rack = generateRack();
      player.blocked = false;

      callback?.({ ok: true });
      emitRoomState(room);
    });

    // ------------------------------------------------------------------------
    // 6. Leave Room
    // ------------------------------------------------------------------------
    socket.on('leave_room', (_, callback) => {
      const room = rooms[socket.roomId];
      if (room && socket.playerId) {
        room.players = room.players.filter((p) => p.id !== socket.playerId);
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

    // ------------------------------------------------------------------------
    // 7. Socket Disconnect Handling (60s Reconnect Grace Period)
    // ------------------------------------------------------------------------
    socket.on('disconnect', () => {
      const room = rooms[socket.roomId];
      if (!room) return;

      const player = room.players.find((p) => p.id === socket.playerId);
      if (!player) return;

      player.connected = false;

      const timer = setTimeout(() => {
        if (!player.connected) {
          room.players = room.players.filter((p) => p.id !== socket.playerId);
          if (room.players.length === 0) {
            stopRoomTimer(room.roomId);
            delete rooms[room.roomId];
          } else {
            room.hostSeat = room.players[0].seat;
            if (room.status === 'playing') {
              const activePlayers = room.players.filter((p) => p.connected);
              if (activePlayers.length === 0) {
                stopRoomTimer(room.roomId);
                delete rooms[room.roomId];
                return;
              }
              if (activePlayers.length === 1 && room.gameMode === 'timed') {
                room.status = 'finished';
                room.winnerSeat = activePlayers[0].seat;
                room.reason = 'disconnect';
                stopRoomTimer(room.roomId);
              }
            }
            emitRoomState(room);
          }
        }
      }, 60000);

      disconnectTimers.set(socket.playerId, timer);
      emitRoomState(room);
    });
  });
}

module.exports = {
  registerSocketHandlers
};
