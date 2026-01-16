/**
 * Comment Controller
 * 
 * Handles operations for comments on blog posts.
 */

const Comment = require('../models/Comment');
const Post = require('../models/Post');

/**
 * Create a new comment
 * POST /api/posts/:postId/comments
 */
const createComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.userId;
    const { comment } = req.body;

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found.'
      });
    }

    const commentId = await Comment.create(postId, userId, comment);
    const newComment = await Comment.findById(commentId);

    res.status(201).json({
      success: true,
      message: 'Comment added successfully.',
      data: { comment: newComment }
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding comment.'
    });
  }
};

/**
 * Get all comments for a post
 * GET /api/posts/:postId/comments
 */
const getCommentsByPost = async (req, res) => {
  try {
    const postId = req.params.postId;

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found.'
      });
    }

    const comments = await Comment.findByPostId(postId);

    res.json({
      success: true,
      data: { comments },
      count: comments.length
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching comments.'
    });
  }
};

/**
 * Update a comment
 * PUT /api/comments/:id
 */
const updateComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.userId;
    const userRole = req.user.role || 'user';
    const { comment } = req.body;

    const updated = await Comment.update(commentId, userId, comment, userRole);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found or you do not have permission to update it.'
      });
    }

    const updatedComment = await Comment.findById(commentId);

    res.json({
      success: true,
      message: 'Comment updated successfully.',
      data: { comment: updatedComment }
    });
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating comment.'
    });
  }
};

/**
 * Delete a comment
 * DELETE /api/comments/:id
 */
const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const deleted = await Comment.delete(commentId, userId, userRole);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found or you do not have permission to delete it.'
      });
    }

    res.json({
      success: true,
      message: 'Comment deleted successfully.'
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting comment.'
    });
  }
};

module.exports = {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment
};

