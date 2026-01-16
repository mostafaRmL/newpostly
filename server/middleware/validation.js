/**
 * Input Validation Middleware
 * 
 * Provides validation functions for common input types
 * to ensure data integrity and security.
 */

/**
 * Validate email format
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * Requirements: at least 6 characters
 */
const validatePassword = (password) => {
  return password && password.length >= 6;
};

/**
 * Validate username
 * Requirements: 3-50 characters, alphanumeric and underscores only
 */
const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,50}$/;
  return usernameRegex.test(username);
};

/**
 * Sanitize string input (basic XSS prevention)
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/[<>]/g, '');
};

/**
 * Validate registration input
 */
const validateRegister = (req, res, next) => {
  const { username, email, password } = req.body;

  // Check required fields
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'All fields (username, email, password) are required.'
    });
  }

  // Validate username
  if (!validateUsername(username)) {
    return res.status(400).json({
      success: false,
      message: 'Username must be 3-50 characters and contain only letters, numbers, and underscores.'
    });
  }

  // Validate email
  if (!validateEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format.'
    });
  }

  // Validate password
  if (!validatePassword(password)) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long.'
    });
  }

  next();
};

/**
 * Validate login input
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required.'
    });
  }

  next();
};

/**
 * Validate post creation/update
 */
const validatePost = (req, res, next) => {
  const { post_title, post_text, category_id } = req.body;

  if (!post_title || !post_text) {
    return res.status(400).json({
      success: false,
      message: 'Post title and text are required.'
    });
  }

  if (post_title.length > 255) {
    return res.status(400).json({
      success: false,
      message: 'Post title must be 255 characters or less.'
    });
  }

  if (category_id && isNaN(parseInt(category_id))) {
    return res.status(400).json({
      success: false,
      message: 'Invalid category ID.'
    });
  }

  next();
};

/**
 * Validate comment creation
 */
const validateComment = (req, res, next) => {
  const { comment } = req.body;

  if (!comment || !comment.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Comment text is required.'
    });
  }

  if (comment.length > 1000) {
    return res.status(400).json({
      success: false,
      message: 'Comment must be 1000 characters or less.'
    });
  }

  next();
};

module.exports = {
  validateEmail,
  validatePassword,
  validateUsername,
  sanitizeString,
  validateRegister,
  validateLogin,
  validatePost,
  validateComment
};

