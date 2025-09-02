// models/TaskCode.js
import mongoose from 'mongoose';

const taskCodeSchema = new mongoose.Schema({
 code: { type: String, unique: true },
  amount: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Giveaway', taskCodeSchema);
