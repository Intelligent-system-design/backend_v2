import { Router } from 'express';
import { getAIMove, getAIHint, validateAIMove } from '../controllers/ai.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/move', authenticateToken, getAIMove);
router.post('/hint', authenticateToken, getAIHint);
router.post('/validate', authenticateToken, validateAIMove);

export default router;
