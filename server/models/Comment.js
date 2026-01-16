/**
 * Comment Model
 * 
 * Handles all database operations related to comments on blog posts.
 */

const { pool } = require('../config/database');

class Comment {
  /**
   * Create a new comment
   */
  static async create(postId, userId, comment) {
    const [result] = await pool.execute(
      'INSERT INTO comments (post_id, user_id, comment) VALUES (?, ?, ?)',
      [postId, userId, comment]
    );
    return result.insertId;
  }

  /**
   * Get all comments for a specific post
   */
  static async findByPostId(postId) {
    const [rows] = await pool.execute(
      `SELECT 
        c.comment_id,
        c.comment,
        c.created_at,
        c.updated_at,
        u.user_id,
        u.username
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.user_id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC`,
      [postId]
    );
    return rows;
  }

  /**
   * Get a single comment by ID
   */
  static async findById(commentId) {
    const [rows] = await pool.execute(
      `SELECT 
        c.comment_id,
        c.comment,
        c.created_at,
        c.updated_at,
        c.post_id,
        u.user_id,
        u.username
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.user_id
      WHERE c.comment_id = ?`,
      [commentId]
    );
    return rows[0] || null;
  }

  /**
   * Update a comment
   */
  static async update(commentId, userId, comment, userRole = 'user') {
    // Build WHERE clause - admins can edit any comment, users can only edit their own
    let query = 'UPDATE comments SET comment = ? WHERE comment_id = ?';
    const params = [comment, commentId];
    
    if (userRole !== 'admin') {
      query += ' AND user_id = ?';
      params.push(userId);
    }

    const [result] = await pool.execute(query, params);
    return result.affectedRows > 0;
  }

  /**
   * Delete a comment
   */
  static async delete(commentId, userId, userRole = 'user') {
    let query = 'DELETE FROM comments WHERE comment_id = ?';
    const params = [commentId];

    // Only allow users to delete their own comments (unless admin)
    if (userRole !== 'admin') {
      query += ' AND user_id = ?';
      params.push(userId);
    }

    const [result] = await pool.execute(query, params);
    return result.affectedRows > 0;
  }
}

module.exports = Comment;

