"use strict";
// Mock AI Service until Pikafish engine is integrated
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMove = exports.getHint = exports.calculateBestMove = void 0;
const calculateBestMove = async (fen) => {
    return new Promise((resolve) => {
        // Simulate AI thinking time (1.5 seconds)
        setTimeout(() => {
            // Return a mocked best move and slightly modified FEN
            // In a real scenario, this would spawn a child process to Pikafish
            resolve({
                bestMove: 'h2e2',
                score: 0.75,
                newFen: fen // Just returning the same fen in mock
            });
        }, 1500);
    });
};
exports.calculateBestMove = calculateBestMove;
const getHint = async (fen) => {
    return new Promise((resolve) => {
        // Simulate thinking time
        setTimeout(() => {
            resolve({
                suggestedMove: 'h2e2',
                score: 0.65,
                explanation: 'Đây là nước đi tối ưu, giúp bảo vệ tướng và đe dọa pháo của đối phương (Mock Data).'
            });
        }, 1000);
    });
};
exports.getHint = getHint;
const validateMove = async (fen, move) => {
    return new Promise((resolve) => {
        // Basic mock validation
        resolve({
            isValid: true,
            reason: 'Move is valid (Mock)'
        });
    });
};
exports.validateMove = validateMove;
