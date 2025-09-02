import express from 'express';
import {generateOtp, register, login, generateForgotOtp, resetPassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/generate-otp', generateOtp);
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password/generate-otp', generateForgotOtp);
router.post('/forgot-password/reset', resetPassword);
export default router;
