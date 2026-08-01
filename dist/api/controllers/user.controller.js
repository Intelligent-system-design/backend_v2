"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeaderboard = exports.getUserProfile = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const getUserProfile = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                eloScore: true,
                winMatches: true,
                loseMatches: true,
                drawMatches: true,
            }
        });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        const totalMatches = user.winMatches + user.loseMatches + user.drawMatches;
        const winRate = totalMatches > 0 ? (user.winMatches / totalMatches) * 100 : 0;
        res.status(200).json({
            userId: user.id,
            username: user.username,
            email: user.email,
            eloScore: user.eloScore,
            winMatches: user.winMatches,
            loseMatches: user.loseMatches,
            drawMatches: user.drawMatches,
            totalMatches,
            winRate: Math.round(winRate * 100) / 100
        });
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getUserProfile = getUserProfile;
const getLeaderboard = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            prisma_1.default.user.findMany({
                orderBy: { eloScore: 'desc' },
                skip,
                take: limit,
                select: {
                    id: true,
                    username: true,
                    eloScore: true,
                    winMatches: true,
                    loseMatches: true,
                    drawMatches: true,
                }
            }),
            prisma_1.default.user.count()
        ]);
        const data = users.map((user, index) => {
            const totalMatches = user.winMatches + user.loseMatches + user.drawMatches;
            const winRate = totalMatches > 0 ? (user.winMatches / totalMatches) * 100 : 0;
            return {
                rank: skip + index + 1,
                userId: user.id,
                username: user.username,
                eloScore: user.eloScore,
                winRate: Math.round(winRate * 100) / 100
            };
        });
        res.status(200).json({
            data,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    }
    catch (error) {
        console.error('Get leaderboard error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getLeaderboard = getLeaderboard;
