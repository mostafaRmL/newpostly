/**
 * Like Controller
 * 
 * Handles operations for post likes.
 */

const Like = require('../models/Like');
const Post = require('../models/Post');

/**
 * Toggle like on a post
 * POST /api/posts/:id/like
 */
const toggleLike = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found.'
      });
    }

    // Check if user has already liked
    const hasLiked = await Like.hasLiked(postId, userId);

    if (hasLiked) {
      // Unlike
      const removed = await Like.removeLike(postId, userId);
      if (removed) {
        const updatedPost = await Post.findById(postId);
        res.json({
          success: true,
          message: 'Post unliked successfully.',
          data: {
            liked: false,
            likes_count: updatedPost.likes_count
          }
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Failed to unlike post.'
        });
      }
    } else {
      // Like
      const added = await Like.addLike(postId, userId);
      if (added) {
        const updatedPost = await Post.findById(postId);
        res.json({
          success: true,
          message: 'Post liked successfully.',
          data: {
            liked: true,
            likes_count: updatedPost.likes_count
          }
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Failed to like post. You may have already liked it.'
        });
      }
    }
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while toggling like.'
    });
  }
};

/**
 * Check if user has liked a post
 * GET /api/posts/:id/like
 */
const checkLike = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;

    const hasLiked = await Like.hasLiked(postId, userId);

    res.json({
      success: true,
      data: { liked: hasLiked }
    });
  } catch (error) {
    console.error('Check like error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while checking like status.'
    });
  }
};

/**
 * Get all users who liked a post
 * GET /api/posts/:id/likers
 */
const getLikers = async (req, res) => {
  try {
    const postId = req.params.id;
    const likers = await Like.getLikers(postId);

    res.json({
      success: true,
      data: { likers },
      count: likers.length
    });
  } catch (error) {
    console.error('Get likers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching likers.'
    });
  }
};

module.exports = {
  toggleLike,
  checkLike,
  getLikers
};

