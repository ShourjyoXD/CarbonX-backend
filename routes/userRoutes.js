const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getUserProfile, getLeaderboard } = require('../controllers/userController');

const router = express.Router();
router.get('/profile', protect, getUserProfile);
router.get('/leaderboard', getLeaderboard);

module.exports = router;