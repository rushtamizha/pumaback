import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { deposits, withdrawals, commissions, rewards } from '../controllers/transactionController.js';

const router = express.Router();

router.get('/deposits', authMiddleware, deposits);
router.get('/withdrawals', authMiddleware, withdrawals);
router.get('/commissions', authMiddleware, commissions);
router.get('/rewards', authMiddleware, rewards);

export default router;
