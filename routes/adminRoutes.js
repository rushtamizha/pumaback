import express from 'express';

import { adminMiddleware } from '../middlewares/adminMiddleware.js';

import {
  adminLogin,
  adminRegister,
  addProduct,
  getAllUsers,
  getUserById,
  updateUserDetails,
  getWithdrawals,
  updateWithdrawalStatus,
  createTaskCode
} from '../controllers/adminController.js';

// routes/adminRoutes.js


const router = express.Router();

router.post('/register', adminRegister);
router.post('/login', adminLogin);

router.post('/add-product', adminMiddleware, addProduct);

router.get('/users', adminMiddleware, getAllUsers);
router.get('/users/:id', adminMiddleware, getUserById);
router.put('/users/:id', adminMiddleware, updateUserDetails);

router.get('/withdrawals', adminMiddleware, getWithdrawals);
router.put('/withdrawals/:id', adminMiddleware, updateWithdrawalStatus);
// routes/adminRoutes.js
router.post('/task-code', adminMiddleware, createTaskCode)

export default router;