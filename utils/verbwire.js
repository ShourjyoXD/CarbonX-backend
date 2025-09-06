const axios = require('axios');

const VERBWIRE_API_KEY = process.env.VERBWIRE_API_KEY;

exports.mintEcoBadge = async (recipientAddress, imageUrl, metadata) => {
  try {
    const options = {
      method: 'POST',
      url: 'https://api.verbwire.com/v1/nft/mint/quickMintFromUrl',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'X-API-KEY': VERBWIRE_API_KEY,
      },
      data: {
        chain: 'polygon',
        recipientAddress: recipientAddress,
        imageUrl: imageUrl,
        name: metadata.name,
        description: metadata.description,
        attributes: [
            { trait_type: "Challenge Title", value: metadata.challengeTitle },
            { trait_type: "User Wallet Address", value: metadata.walletAddress },
            { trait_type: "Date Completed", value: metadata.dateCompleted },
            { trait_type: "Reward XP", value: metadata.rewardXP },
            { trait_type: "Proof Photo", value: metadata.proofPhotoUrl }
        ]
      }
    };

    const response = await axios.request(options);
    console.log('NFT Minting Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error minting NFT:', error.response ? error.response.data : error.message);
    throw new Error('NFT minting failed');
  }
};