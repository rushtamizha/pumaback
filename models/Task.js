import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    dailyCheckInDate: Date,
    validDirectRefer: { type: Number, default: 0 },
    thirdDirectReferBonus: { type: Boolean, default: false }
});

export default mongoose.model("Task", taskSchema);
