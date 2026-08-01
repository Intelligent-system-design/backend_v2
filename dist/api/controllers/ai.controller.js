"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAIMove = exports.getAIHint = exports.getAIMove = void 0;
const aiService = __importStar(require("../../services/ai.service"));
const getAIMove = async (req, res) => {
    try {
        const { fen } = req.body;
        if (!fen) {
            res.status(400).json({ error: 'Missing FEN string' });
            return;
        }
        const result = await aiService.calculateBestMove(fen);
        res.status(200).json({
            bestMove: result.bestMove,
            evaluationScore: result.score,
            newFen: result.newFen,
            nodesVisited: 15000 // Mock data
        });
    }
    catch (error) {
        console.error('AI Move Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getAIMove = getAIMove;
const getAIHint = async (req, res) => {
    try {
        const { fen } = req.body;
        if (!fen) {
            res.status(400).json({ error: 'Missing FEN string' });
            return;
        }
        const result = await aiService.getHint(fen);
        res.status(200).json({
            suggestedMove: result.suggestedMove,
            score: result.score,
            explanation: result.explanation
        });
    }
    catch (error) {
        console.error('AI Hint Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getAIHint = getAIHint;
const validateAIMove = async (req, res) => {
    try {
        const { fen, move } = req.body;
        if (!fen || !move) {
            res.status(400).json({ error: 'Missing FEN or move' });
            return;
        }
        const result = await aiService.validateMove(fen, move);
        res.status(200).json(result);
    }
    catch (error) {
        console.error('AI Validate Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.validateAIMove = validateAIMove;
