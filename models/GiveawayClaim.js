import mongoose from "mongoose";

const giveawayClaimSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  code: { type: String },
  claimedAt: { type: Date, default: Date.now }
});

giveawayClaimSchema.index({ user: 1, code: 1 }, { unique: true });

export default mongoose.model("GiveawayClaim", giveawayClaimSchema);
