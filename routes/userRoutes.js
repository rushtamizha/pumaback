import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { getProfile, getBank, addBank, deposit, withdraw, dailyCheckin } from '../controllers/userController.js';
import { getOrders } from '../controllers/userController.js';
import { redeemTaskCode } from '../controllers/giveawayController.js';

const router = express.Router();

router.get('/profile', authMiddleware, getProfile);
router.get('/bank',authMiddleware, getBank);
router.get('/order',authMiddleware, getOrders);
router.post('/add-bank',  authMiddleware,addBank);
router.post('/deposit', authMiddleware, deposit);
router.post('/withdraw', authMiddleware, withdraw);
router.post('/task/checkin', authMiddleware, dailyCheckin);
router.post('/redeem-code', authMiddleware, redeemTaskCode);
export default router;
