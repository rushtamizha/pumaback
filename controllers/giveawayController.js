// controllers/taskController.js
import GiveawayCode from '../models/Giveaway.js';
import GiveawayClaim from '../models/GiveawayClaim.js';
import Wallet from '../models/Wallet.js';

export const redeemTaskCode = async (req, res) => {
 const userId = req.user._id;
  const { code } = req.body;

  const giveaway = await GiveawayCode.findOne({ code, isActive: true });
  if (!giveaway) return res.status(400).json({ message: "Invalid or expired code" });

  // Check if user already claimed this code
  const alreadyClaimed = await GiveawayClaim.findOne({ user: userId, code });
  if (alreadyClaimed) return res.status(400).json({ message: "You already claimed this code" });

  // Give cashback
  const wallet = await Wallet.findOne({ user: userId });
  wallet.balance += giveaway.amount;
  await wallet.save();

  // Save claim record
  const claim = new GiveawayClaim({ user: userId, code });
  await claim.save();

  res.json({ message: `Successfully claimed ₹${giveaway.amount}` });
};
