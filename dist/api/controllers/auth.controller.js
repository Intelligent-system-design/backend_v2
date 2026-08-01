"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = exports.loginUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const loginUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        if (!password || (!email && !username)) {
            res.status(400).json({ error: 'Missing credentials' });
            return;
        }
        const user = await prisma_1.default.user.findFirst({
            where: {
                OR: [
                    { email: email || '' },
                    { username: username || '' }
                ]
            }
        });
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const isMatch = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        res.status(200).json({
            token,
            expiresIn: 3600,
            user: {
                userId: user.id,
                username: user.username,
                email: user.email,
                eloScore: user.eloScore,
                role: user.role
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.loginUser = loginUser;
const registerUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        if (!email || !username || !password) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        const existingUser = await prisma_1.default.user.findFirst({
            where: {
                OR: [{ email }, { username }]
            }
        });
        if (existingUser) {
            res.status(409).json({ error: 'Username or email already exists' });
            return;
        }
        const salt = await bcrypt_1.default.genSalt(10);
        const passwordHash = await bcrypt_1.default.hash(password, salt);
        const newUser = await prisma_1.default.user.create({
            data: {
                email,
                username,
                passwordHash
            }
        });
        const token = jsonwebtoken_1.default.sign({ userId: newUser.id, role: newUser.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        res.status(201).json({
            token,
            expiresIn: 3600,
            user: {
                userId: newUser.id,
                username: newUser.username,
                email: newUser.email,
                eloScore: newUser.eloScore,
                role: newUser.role
            }
        });
    }
    catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.registerUser = registerUser;
