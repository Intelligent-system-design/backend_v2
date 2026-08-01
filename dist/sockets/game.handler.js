"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGameEvents = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const handleGameEvents = (io, socket) => {
    const userId = socket.data.userId;
    socket.on('make_move', async (data) => {
        try {
            const roomId = `match_${data.matchId}`;
            // Save move to DB
            const match = await prisma_1.default.match.findUnique({
                where: { id: data.matchId },
                include: { moves: true }
            });
            if (!match || match.status !== 'PLAYING') {
                socket.emit('error', 'Match is not active');
                return;
            }
            const isUserInMatch = match.redPlayerId === userId || match.blackPlayerId === userId;
            if (!isUserInMatch) {
                socket.emit('error', 'You are not part of this match');
                return;
            }
            await prisma_1.default.move.create({
                data: {
                    matchId: data.matchId,
                    playerId: userId,
                    moveNumber: match.moves.length + 1,
                    moveStr: data.moveStr,
                    fen: data.fen,
                    timeCost: data.timeCost
                }
            });
            // Broadcast move to other player in the room
            socket.to(roomId).emit('move_made', {
                playerId: userId,
                fen: data.fen,
                moveStr: data.moveStr
            });
        }
        catch (error) {
            console.error('Error handling move:', error);
        }
    });
    socket.on('resign', async (data) => {
        try {
            const match = await prisma_1.default.match.findUnique({ where: { id: data.matchId } });
            if (!match)
                return;
            const winnerId = match.redPlayerId === userId ? match.blackPlayerId : match.redPlayerId;
            const loserId = userId;
            await prisma_1.default.match.update({
                where: { id: data.matchId },
                data: {
                    status: 'FINISHED',
                    winnerId,
                    endedAt: new Date()
                }
            });
            // Cập nhật ELO đơn giản (+30 cho người thắng, -30 cho người thua)
            await prisma_1.default.user.update({
                where: { id: winnerId },
                data: {
                    eloScore: { increment: 30 },
                    winMatches: { increment: 1 }
                }
            });
            await prisma_1.default.user.update({
                where: { id: loserId },
                data: {
                    eloScore: { decrement: 30 },
                    loseMatches: { increment: 1 }
                }
            });
            const roomId = `match_${data.matchId}`;
            io.to(roomId).emit('match_ended', { winnerId, reason: 'resign' });
        }
        catch (error) {
            console.error('Error handling resign:', error);
        }
    });
};
exports.handleGameEvents = handleGameEvents;
