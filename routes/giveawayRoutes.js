import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { redeemTaskCode } from '../controllers/giveawayController.js';

const router = express.Router();
router.post('/redeem', authMiddleware, redeemTaskCode);

export default router;
