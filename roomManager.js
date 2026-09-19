'use strict';

/**
 * ============================================================================
 * ROOM MANAGER & TIMERS
 * ============================================================================
 */

const rooms = {};
const roomTickers = new Map();
const disconnectTimers = new Map();

/**
 * Filter and format room state for client consumption
 */
function getPublicState(room) {
  return {
    roomId: room.roomId,
    status: room.status,
    gameMode: room.gameMode || 'timed',
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

/**
 * Create room manager functions bound to the Socket.IO instance
 */
function createRoomManager(io) {
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

    // Endless Mode: counts up elapsed seconds indefinitely
    if (room.gameMode === 'endless') {
      room.remaining = 0;

      const ticker = setInterval(() => {
        if (room.status !== 'playing') {
          stopRoomTimer(room.roomId);
          return;
        }

        room.remaining++;
        io.to(room.roomId).emit('timer_tick', { remaining: room.remaining, elapsed: true });
      }, 1000);

      roomTickers.set(room.roomId, ticker);
      return;
    }

    // Timed Mode: countdown timer
    room.remaining = room.matchDuration;

    const ticker = setInterval(() => {
      if (room.status !== 'playing') {
        stopRoomTimer(room.roomId);
        return;
      }

      room.remaining--;
      io.to(room.roomId).emit('timer_tick', { remaining: room.remaining, elapsed: false });

      if (room.remaining <= 0) {
        stopRoomTimer(room.roomId);
        room.status = 'finished';
        room.reason = 'time';

        // Calculate winner with highest score among all connected players
        if (room.players.length > 0) {
          const sorted = [...room.players].sort((a, b) => b.score - a.score);
          if (sorted.length === 1 || sorted[0].score > sorted[1].score) {
            room.winnerSeat = sorted[0].seat;
          } else {
            room.winnerSeat = null; // tie
          }
        }
        emitRoomState(room);
      }
    }, 1000);

    roomTickers.set(room.roomId, ticker);
  }

  return {
    rooms,
    roomTickers,
    disconnectTimers,
    getPublicState,
    emitRoomState,
    stopRoomTimer,
    startRoomTimer
  };
}

module.exports = {
  createRoomManager
};
