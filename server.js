'use strict';

/**
 * ============================================================================
 * BLOCK BLASTER · DUEL - SERVER ENTRY POINT
 * ============================================================================
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const { createRoomManager } = require('./roomManager');
const { registerSocketHandlers } = require('./socketHandler');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Serve static frontend files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Initialize room manager and register socket event handlers
const roomManager = createRoomManager(io);
registerSocketHandlers(io, roomManager);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Block Blaster Duel listening on port ${PORT}`);
});

module.exports = { app, server, io };
