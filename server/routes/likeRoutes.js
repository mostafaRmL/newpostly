/**
 * Like Routes
 * 
 * Routes for post likes functionality.
 */

const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const { authenticateToken } = require('../middleware/auth');

// All like routes require authentication
router.post('/:id/like', authenticateToken, likeController.toggleLike);
router.get('/:id/like', authenticateToken, likeController.checkLike);
router.get('/:id/likers', likeController.getLikers);

module.exports = router;

