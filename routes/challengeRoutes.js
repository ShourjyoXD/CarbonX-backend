const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { submitChallengeProof } = require('../controllers/challengeController');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' }); 

const router = express.Router();

router.post('/submit', protect, upload.single('proofImage'), submitChallengeProof);

module.exports = router;