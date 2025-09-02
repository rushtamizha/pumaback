import Deposit from '../models/Deposit.js';
import Withdrawal from '../models/Withdrawal.js';
import Commission from '../models/Commission.js';
import Reward from '../models/Reward.js';

export const deposits = async (req, res) => {
    const records = await Deposit.find({ user: req.user._id });
    res.json(records);
};

export const withdrawals = async (req, res) => {
    const records = await Withdrawal.find({ user: req.user._id });
    res.json(records);
};

export const commissions = async (req, res) => {
    const records = await Commission.find({ user: req.user._id });
    res.json(records);
};

export const rewards = async (req, res) => {
    const records = await Reward.find({ user: req.user._id });
    res.json(records);
};
