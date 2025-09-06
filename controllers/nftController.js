const { mintEcoBadge } = require('../utils/verbwire');
const User = require('../models/User');


const BADGE_IMAGE_URL = 'https://your-domain.com/path/to/eco-badge.png';

// @desc    Mints an NFT for a user and updates their record
// @access  Internal (called by challengeController)
exports.mintNFTForUser = async (user, challenge, proof) => {
  try {
    const nftMetadata = {
      name: `Eco-Badge: ${challenge.title}`,
      description: `Awarded for completing the challenge: "${challenge.description}"`,
      challengeTitle: challenge.title,
      walletAddress: user.walletAddress,
      dateCompleted: new Date().toISOString(),
      rewardXP: challenge.rewardXP,
      proofPhotoUrl: proof.fileUrl,
    };
    const mintResponse = await mintEcoBadge(user.walletAddress, BADGE_IMAGE_URL, nftMetadata);
    const tokenId = mintResponse.tokenId;

    if (tokenId) {
      user.badges.push(tokenId);
      await user.save();
      console.log(`NFT with Token ID ${tokenId} minted and added to user ${user.walletAddress}`);
    }

    return mintResponse;
  } catch (error) {
    console.error('Failed to mint NFT for user:', error.message);
    throw error;
  }
};