"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSockets = exports.connectedUsers = void 0;
const room_handler_1 = require("./room.handler");
const game_handler_1 = require("./game.handler");
// Store connected users mapping (socket.id -> userId)
exports.connectedUsers = new Map();
const initSockets = (io) => {
    io.use((socket, next) => {
        // In a real app, you would verify the JWT token here
        const token = socket.handshake.auth.token;
        if (token) {
            // Decode token and get userId...
            // For now, we'll just accept a userId directly for simplicity
            const userId = socket.handshake.auth.userId;
            if (userId) {
                socket.data.userId = userId;
                return next();
            }
        }
        return next(new Error('Authentication error'));
    });
    io.on('connection', (socket) => {
        const userId = socket.data.userId;
        exports.connectedUsers.set(socket.id, userId);
        console.log(`User ${userId} connected with socket ${socket.id}`);
        // Register event handlers
        (0, room_handler_1.handleRoomEvents)(io, socket);
        (0, game_handler_1.handleGameEvents)(io, socket);
        socket.on('disconnect', () => {
            exports.connectedUsers.delete(socket.id);
            console.log(`User ${userId} disconnected`);
        });
    });
};
exports.initSockets = initSockets;
