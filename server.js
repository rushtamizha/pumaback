import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import giveawayRoutes from './routes/giveawayRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/giveaway', giveawayRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/admin', adminRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => console.log('Server running'));
    })
    .catch((err) => console.log(err));
