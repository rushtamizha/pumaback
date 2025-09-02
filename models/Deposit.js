import mongoose from 'mongoose';

const depositSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: Number,
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Deposit", depositSchema);
