"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get('/profile', auth_middleware_1.authenticateToken, user_controller_1.getUserProfile);
router.get('/leaderboard', auth_middleware_1.authenticateToken, user_controller_1.getLeaderboard);
exports.default = router;
