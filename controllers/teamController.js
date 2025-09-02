import Referral from '../models/Referral.js';
import User from '../models/User.js';

export const myTeam = async (req, res) => {
    try {
        const level1Docs = await Referral.find({ referrerUser: req.user._id }).populate('referredUser');
        const level1 = level1Docs.map(r => r.referredUser);

        const level2Docs = await Referral.find({ referrerUser: { $in: level1.map(u => u._id) } }).populate('referredUser');
        const level2 = level2Docs.map(r => r.referredUser);

        const level3Docs = await Referral.find({ referrerUser: { $in: level2.map(u => u._id) } }).populate('referredUser');
        const level3 = level3Docs.map(r => r.referredUser);

        res.json({ level1, level2, level3 });
    } catch (err) {
        console.error('Team fetch error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
