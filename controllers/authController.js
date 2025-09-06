const { ethers } = require('ethers');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');

const generateTokens = (walletAddress) => {
  const accessToken = jwt.sign({ walletAddress }, process.env.JWT_SECRET, {
    expiresIn: '15m' 
  });
  const refreshToken = jwt.sign({ walletAddress }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d' 
  });
  return { accessToken, refreshToken };
};

// @desc    Sign-up/Login with Wallet
// @route   POST /api/auth/wallet-login
// @access  Public
exports.walletLogin = async (req, res) => {
  const { walletAddress, signature } = req.body;
  
  const message = `Sign in to GreenQuest with address: ${walletAddress}`;

  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(401).json({ message: 'Invalid signature' });
    }

    let user = await User.findOne({ walletAddress });
    if (!user) {
      user = await User.create({ walletAddress });
    }

    const { accessToken, refreshToken } = generateTokens(user.walletAddress);

    await RefreshToken.create({ token: refreshToken, walletAddress });

    res.json({ accessToken, refreshToken, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Refresh Access Token
// @route   POST /api/auth/refresh-token
// @access  Public
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh Token not found' });
  }

  try {
    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!storedToken) {
      return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const newAccessToken = jwt.sign({ walletAddress: decoded.walletAddress }, process.env.JWT_SECRET, {
      expiresIn: '15m'
    });
    const newRefreshToken = jwt.sign({ walletAddress: decoded.walletAddress }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '7d'
    });

    storedToken.token = newRefreshToken;
    await storedToken.save();

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired refresh token', error: error.message });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Protected
exports.logout = async (req, res) => {
  const { refreshToken } = req.body;
  await RefreshToken.deleteOne({ token: refreshToken });
  res.status(204).json({ message: 'Logged out successfully' });
};