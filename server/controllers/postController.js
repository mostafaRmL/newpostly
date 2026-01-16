/**
 * Post Controller
 * 
 * Handles all CRUD operations for blog posts.
 */

const Post = require('../models/Post');

/**
 * Create a new post
 * POST /api/posts
 */
const createPost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const postData = req.body;

    const postId = await Post.create(userId, postData);
    const newPost = await Post.findById(postId);

    res.status(201).json({
      success: true,
      message: 'Post created successfully.',
      data: { post: newPost }
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating post.'
    });
  }
};

/**
 * Get all posts
 * GET /api/posts
 * Query params: search, category_id, limit, offset
 */
const getAllPosts = async (req, res) => {
  try {
    const options = {
      search: req.query.search || null,
      category_id: req.query.category_id || null,
      limit: req.query.limit ? parseInt(req.query.limit) : null,
      offset: req.query.offset ? parseInt(req.query.offset) : null
    };

    const posts = await Post.findAll(options);

    res.json({
      success: true,
      data: { posts },
      count: posts.length
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching posts.'
    });
  }
};

/**
 * Get a single post by ID
 * GET /api/posts/:id
 */
const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found.'
      });
    }

    res.json({
      success: true,
      data: { post }
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching post.'
    });
  }
};

/**
 * Update a post
 * PUT /api/posts/:id
 */
const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;
    const userRole = req.user.role || 'user';
    const updates = req.body;

    const updated = await Post.update(postId, userId, updates, userRole);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Post not found or you do not have permission to update it.'
      });
    }

    const updatedPost = await Post.findById(postId);

    res.json({
      success: true,
      message: 'Post updated successfully.',
      data: { post: updatedPost }
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating post.'
    });
  }
};

/**
 * Delete a post
 * DELETE /api/posts/:id
 */
const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const deleted = await Post.delete(postId, userId, userRole);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Post not found or you do not have permission to delete it.'
      });
    }

    res.json({
      success: true,
      message: 'Post deleted successfully.'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting post.'
    });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
};

