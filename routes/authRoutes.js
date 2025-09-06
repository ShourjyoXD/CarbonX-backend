const express = require('express');
const { walletLogin, refreshToken, logout } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/wallet-login', walletLogin);
router.post('/refresh-token', refreshToken);

router.post('/logout', protect, logout);

module.exports = router;