import mongoose from 'mongoose';

const commissionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: Number,
    level: Number,
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Commission", commissionSchema);
