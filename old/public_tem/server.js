'use strict';
// Install: npm install express socket.io | Run: HOST=0.0.0.0 PORT=3000 node server.js
const express = require('express');
const http = require('node:http');
const { randomUUID, randomInt } = require('node:crypto');
const { Server } = require('socket.io');
const path = require('node:path');
const { networkInterfaces } = require('node:os');
const HOST = process.env.HOST || '0.0.0.0';
const PORT = Number(process.env.PORT ?? 3000);
if (!Number.isInteger(PORT) || PORT < 0 || PORT > 65535) {
  throw new Error('PORT must be an integer from 0 to 65535 (0 selects an available port).');
}
const DISCONNECT_GRACE_PERIOD = 60_000;
const MAX_ROOMS = 1000;
const rooms = new Map();
const app = express();
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'same-origin');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' ws: wss:; img-src 'self' data:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'");
  next();
});
app.use(express.static(path.join(__dirname, 'public')));
const server = http.createServer(app);
const io = new Server(server, { maxHttpBufferSize: 8192, serveClient: true });
const SHAPES = [
  [[0,0]], [[0,0],[1,0]], [[0,0],[0,1]], [[0,0],[1,0],[2,0]],
  [[0,0],[0,1],[0,2]], [[0,0],[1,0],[0,1],[1,1]],
  [[0,0],[1,0],[2,0],[3,0]], [[0,0],[0,1],[0,2],[0,3]],
  [[0,0],[0,1],[0,2],[1,2]], [[0,0],[1,0],[2,0],[1,1]],
  [[1,0],[2,0],[0,1],[1,1]], [[0,0],[1,0],[1,1],[2,1]],
  [[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],[0,2],[1,2],[2,2]],
  [[0,0],[1,0],[2,0],[3,0],[4,0]], [[0,0],[0,1],[0,2],[0,3],[0,4]],
];
const grid = () => Array.from({length:8}, () => Array(8).fill(0));
const rack = () => Array.from({length:3}, () => ({ id: randomUUID(), cells: SHAPES[randomInt(SHAPES.length)] }));
function fits(board, cells, x, y) {
  return cells.every(([dx,dy]) => x+dx >= 0 && x+dx < 8 && y+dy >= 0 && y+dy < 8 && !board[y+dy][x+dx]);
}
function blocked(p) {
  return !p.rack.some(piece => {
    for (let y=0;y<8;y++) for (let x=0;x<8;x++) if (fits(p.grid,piece.cells,x,y)) return true;
    return false;
  });
}
function timeLeft(room) { return room.status === 'playing' ? Math.max(0, Math.ceil((room.endsAt-Date.now())/1000)) : room.remaining; }
function sanitizeRoom(room, viewerId) {
  return { roomId:room.id, hostSeat:room.hostSeat, status:room.status, targetScore:room.targetScore,
    matchDuration:room.matchDuration, remaining:timeLeft(room), winnerSeat:room.winnerSeat,
    reason:room.reason, revision:room.revision,
    players:room.players.map(p => ({ seat:p.seat, name:p.name, connected:!!p.socketId, score:p.score,
      grid:p.grid, blocked:p.blocked, rack:p.id === viewerId ? p.rack : [] })) };
}
function broadcast(room, action = null) {
  room.revision++;
  for (const p of room.players) if (p.socketId) io.to(p.socketId).emit('room_state', { ...sanitizeRoom(room,p.id), action });
}
function finish(room, reason, winnerSeat) {
  if (room.status !== 'playing') return;
  room.remaining = timeLeft(room);
  room.status = 'finished'; room.reason = reason;
  if (winnerSeat !== undefined) room.winnerSeat = winnerSeat;
  else {
    const [a,b] = room.players;
    room.winnerSeat = !b || a.score > b.score ? a.seat : b.score > a.score ? b.seat : null;
  }
  clearInterval(room.tick); room.tick = null;
  broadcast(room);
}
function expire(room, player) {
  if (player.socketId || !rooms.has(room.id)) return;
  room.players = room.players.filter(p => p !== player);
  if (!room.players.length) { clearInterval(room.tick); rooms.delete(room.id); return; }
  if (room.status === 'playing') finish(room,'disconnect',room.players[0].seat);
  if (room.hostSeat === player.seat) room.hostSeat = room.players[0].seat;
  broadcast(room);
}
function detach(socket, explicit = false) {
  const room = rooms.get(socket.data.roomId);
  const p = room?.players.find(p => p.id === socket.data.playerId && p.socketId === socket.id);
  if (!p) return;
  p.socketId = null; socket.leave(room.id);
  socket.data.roomId = null; socket.data.playerId = null;
  clearTimeout(p.cleanup);
  if (explicit) expire(room,p);
  else { p.cleanup = setTimeout(() => expire(room,p), DISCONNECT_GRACE_PERIOD); broadcast(room); }
}
io.on('connection', socket => {
  let tokens = 40, last = Date.now();
  socket.use((packet,next) => {
    const now = Date.now(); tokens = Math.min(40,tokens+(now-last)/100); last=now;
    if (tokens < 1) return next(new Error('RATE_LIMIT'));
    tokens--; next();
  });
  function respond(ack, payload) { if (typeof ack === 'function') ack(payload); }
  function withRoom(ack, fn) {
    const room = rooms.get(socket.data.roomId);
    const p = room?.players.find(p => p.id === socket.data.playerId && p.socketId === socket.id);
    if (!p) return respond(ack,{error:'NO_ROOM'});
    fn(room,p);
  }
  socket.on('join_room', (data,ack) => {
    if (!data || typeof data !== 'object') return respond(ack,{error:'INVALID_INPUT'});
    const id = typeof data.roomId === 'string' ? data.roomId.trim().toUpperCase() : '';
    const name = typeof data.playerName === 'string' ? data.playerName.trim().replace(/[\x00-\x1f\x7f]/g,'').slice(0,24) : '';
    if (!/^[A-Z0-9-]{3,16}$/.test(id) || !name) return respond(ack,{error:'INVALID_INPUT'});
    let room = rooms.get(id);
    const existing = room?.players.find(p => p.id === data.playerId);
    if (!existing && room && room.players.length >= 2) return respond(ack,{error:'ROOM_FULL'});
    if (!existing && room?.status === 'playing') return respond(ack,{error:'MATCH_ACTIVE'});
    if (!room && rooms.size >= MAX_ROOMS) return respond(ack,{error:'SERVER_FULL'});
    if (socket.data.roomId && !(socket.data.roomId === id && socket.data.playerId === existing?.id)) { detach(socket,true); room = rooms.get(id); }
    if (!room) {
      room = {id, players:[], hostSeat:null, status:'waiting',targetScore:1200,matchDuration:180,remaining:180,
        winnerSeat:null, reason:null, revision:0,tick:null}; rooms.set(id,room);
    }
    let p = existing;
    if (!p) {
      p = {id:randomUUID(),seat:randomUUID(),name,socketId:null,grid:grid(),rack:[],score:0,blocked:false,streak:0,cleanup:null};
      room.players.push(p); if (!room.hostSeat) room.hostSeat = p.seat;
    }
    clearTimeout(p.cleanup);
    if (p.socketId && p.socketId !== socket.id) {
      const old = io.sockets.sockets.get(p.socketId);
      if (old) { old.data.roomId=null; old.data.playerId=null; old.emit('session_replaced'); old.leave(id); old.disconnect(true); }
    }
    p.socketId=socket.id; p.name=name;
    socket.data.roomId=id; socket.data.playerId=p.id; socket.join(id);
    respond(ack,{ok:true,playerId:p.id,seat:p.seat}); broadcast(room);
  });
  socket.on('configure', (data,ack) => withRoom(ack,(room,p) => {
    if (room.hostSeat !== p.seat) return respond(ack,{error:'HOST_ONLY'});
    if (room.status === 'playing') return respond(ack,{error:'MATCH_ACTIVE'});
    if (!data || !Number.isInteger(data.targetScore) || data.targetScore<100 || data.targetScore>100000 ||
      !Number.isInteger(data.matchDuration) || data.matchDuration<30 || data.matchDuration>3600) return respond(ack,{error:'INVALID_RULES'});
    room.targetScore=data.targetScore; room.matchDuration=data.matchDuration; room.remaining=data.matchDuration;
    broadcast(room); respond(ack,{ok:true});
  }));
  socket.on('start_match', (_,ack) => withRoom(ack,(room,p) => {
    if (room.hostSeat !== p.seat) return respond(ack,{error:'HOST_ONLY'});
    if (room.status === 'playing') return respond(ack,{error:'MATCH_ACTIVE'});
    if (room.players.length !== 2 || room.players.some(p => !p.socketId)) return respond(ack,{error:'NEED_TWO'});
    for (const p of room.players) { p.grid=grid();p.rack=rack();p.score=0;p.blocked=false;p.streak=0; }
    room.status='playing';room.reason=null;room.winnerSeat=null;room.endsAt=Date.now()+room.matchDuration*1000;
    room.remaining=room.matchDuration;
    room.tick=setInterval(() => {
      const remaining=timeLeft(room);
      io.to(room.id).emit('timer_tick',{remaining});
      if (!remaining) finish(room,'time');
    },1000);
    broadcast(room);respond(ack,{ok:true});
  }));
  socket.on('place_piece', (data,ack) => withRoom(ack,(room,p) => {
    if (room.status !== 'playing') return respond(ack,{error:'NOT_PLAYING'});
    if (!timeLeft(room)) { finish(room,'time');return respond(ack,{error:'NOT_PLAYING'}); }
    if (!data || !Number.isInteger(data.x) || !Number.isInteger(data.y)) return respond(ack,{error:'INVALID_PLACEMENT'});
    const piece=p.rack.find(piece => piece.id === data.pieceId);
    if (!piece || !fits(p.grid,piece.cells,data.x,data.y)) return respond(ack,{error:'INVALID_PLACEMENT'});
    for (const [dx,dy] of piece.cells) p.grid[data.y+dy][data.x+dx]=1;
    const rows=[],cols=[];
    for (let n=0;n<8;n++) { if (p.grid[n].every(Boolean)) rows.push(n); if (p.grid.every(row => row[n])) cols.push(n); }
    for (let y=0;y<8;y++) for (let x=0;x<8;x++) if (rows.includes(y)||cols.includes(x)) p.grid[y][x]=0;
    const lines=rows.length+cols.length;
    p.streak=lines?p.streak+1:0;
    const points=piece.cells.length*10+lines*100+50*lines*(lines-1)+Math.max(0,p.streak-1)*25;
    p.score+=points; p.rack=p.rack.filter(item => item.id!==piece.id);
    if (!p.rack.length) p.rack=rack();
    p.blocked=blocked(p);
    broadcast(room,{seat:p.seat,lines,rows,cols,points});
    respond(ack,{ok:true});
    if (p.score>=room.targetScore) finish(room,'target',p.seat);
    else if (room.players.every(p => p.blocked)) finish(room,'blocked');
  }));
  socket.on('leave_room', (_,ack) => {detach(socket,true);respond(ack,{ok:true});});
  socket.on('disconnect', () => detach(socket));
});
if (require.main === module) {
  server.listen(PORT, HOST, () => {
    const port = server.address().port;
    console.log(`Block Blaster listening on ${HOST}:${port}`);
    if (HOST === '0.0.0.0' || HOST === '::') {
      console.log(`Local: http://localhost:${port}`);
      try {
        const addresses = new Set(Object.values(networkInterfaces()).flat()
          .filter(address => address && !address.internal && address.family === 'IPv4')
          .map(address => address.address));
        for (const address of addresses) console.log(`Network: http://${address}:${port}`);
      } catch {
        console.log(`Network: http://<your-LAN-IP>:${port}`);
      }
    } else {
      console.log(`Game: http://${HOST.includes(':') ? `[${HOST}]` : HOST}:${port}`);
    }
  });
  server.on('error', error => { console.error('Server failed:', error.message); process.exitCode = 1; });
  let closing = false;
  const shutdown = () => {
    if (closing) return;
    closing = true;
    for (const room of rooms.values()) {
      clearInterval(room.tick);
      for (const p of room.players) clearTimeout(p.cleanup);
    }
    io.close(() => {
      // Socket closure may create grace timers; cancel those as well.
      for (const room of rooms.values()) for (const p of room.players) clearTimeout(p.cleanup);
      rooms.clear();
    });
    setTimeout(() => process.exit(0), 5000).unref();
  };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}
module.exports = {app,server,io,rooms,sanitizeRoom,DISCONNECT_GRACE_PERIOD};
