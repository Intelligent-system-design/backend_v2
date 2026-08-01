"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sockets_1 = require("./sockets");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
// Khởi tạo Sockets
(0, sockets_1.initSockets)(io);
const auth_routes_1 = __importDefault(require("./api/routes/auth.routes"));
const user_routes_1 = __importDefault(require("./api/routes/user.routes"));
const ai_routes_1 = __importDefault(require("./api/routes/ai.routes"));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/v1/users', user_routes_1.default);
app.use('/api/v1/engine', ai_routes_1.default);
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Xiangqi Backend is running' });
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
