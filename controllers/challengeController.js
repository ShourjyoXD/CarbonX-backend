const Proof = require('../models/Proof');
// @desc    Submit a challenge proof
// @route   POST /api/challenges/submit
// @access  Protected
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

    const newProof = await Proof.create({
      user: user._id, 
      challenge: challengeId,
      fileUrl: uploadedFile.path, 
    });

    console.log('New proof submission created:', newProof);
    
    
    res.status(200).json({ 
      message: 'Challenge proof submitted successfully and awaiting validation!', 
      proofId: newProof._id,
      file: uploadedFile,
    });
  } catch (error) {
    console.error('Error submitting proof:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};