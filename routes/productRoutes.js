import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { listProducts, completeOrder, buyProduct } from '../controllers/productController.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';

const router = express.Router();

// 🛒 List products (GET)
router.get('/products', authMiddleware, listProducts);

// 🛒 Buy product (POST)
router.post('/products/buy', authMiddleware, buyProduct);

// ✅ Complete order (admin or system use) (POST)
router.post('/orders/complete', adminMiddleware, completeOrder);

export default router;
