import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { myTeam } from '../controllers/teamController.js';

const router = express.Router();
router.get('/my-team', authMiddleware, myTeam);

export default router;
