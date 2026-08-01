import { Router } from 'express';
import { getUserProfile, getLeaderboard } from '../controllers/user.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/profile', authenticateToken, getUserProfile);
router.get('/leaderboard', authenticateToken, getLeaderboard);

export default router;
