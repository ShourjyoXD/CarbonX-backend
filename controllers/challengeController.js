const User = require('../models/User');
const Challenge = require('../models/Challenge');
const Proof = require('../models/Proof');

// @desc    Submit a challenge proof
// @route   POST /api/challenges/submit
// @access  Protected
exports.submitChallengeProof = async (req, res) => {
  const { challengeId } = req.body;
  const userWalletAddress = req.user.walletAddress; 
  const uploadedFile = req.file;

  if (!uploadedFile) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  if (!challengeId) {
    return res.status(400).json({ message: 'Challenge ID is required' });
  }

  try {
    const user = await User.findOne({ walletAddress: userWalletAddress });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const newProof = await Proof.create({
      user: user._id, 
      challenge: challengeId,
      fileUrl: uploadedFile.path, 
    });

    newProof.status = 'approved';
    await newProof.save();

    const { rewardXP } = challenge;
    user.xp += rewardXP;
    user.level = Math.floor(user.xp / 100) + 1; 

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (user.lastChallengeDate) {
      const lastDate = new Date(user.lastChallengeDate);
      lastDate.setHours(0, 0, 0, 0);

      const oneDay = 24 * 60 * 60 * 1000;
      const difference = Math.round(Math.abs((today - lastDate) / oneDay));

      if (difference === 1) {
        user.streak += 1; 
      } else if (difference > 1) {
        user.streak = 1; 
      }
    } else {
      user.streak = 1; 
    }
    user.lastChallengeDate = today;

    await user.save();

    res.status(200).json({ 
      message: 'Challenge proof submitted, rewards granted!', 
      proofId: newProof._id,
      user: {
        xp: user.xp,
        level: user.level,
        streak: user.streak,
      },
    });

  } catch (error) {
    console.error('Error submitting proof:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};