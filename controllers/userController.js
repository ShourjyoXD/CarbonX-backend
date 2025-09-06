const User = require('../models/User');

// @desc    Get current user profile
// @route   GET /api/user/profile
// @access  Protected
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ walletAddress: req.user.walletAddress });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      walletAddress: user.walletAddress,
      xp: user.xp,
      level: user.level,
      streak: user.streak,
      badges: user.badges,
      completedChallenges: user.completedChallenges, 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get global leaderboard
// @route   GET /api/user/leaderboard
// @access  Public
exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find({})
      .sort({ xp: -1, level: -1 }) 
      .limit(100) 
      .select('walletAddress xp level streak'); 

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};