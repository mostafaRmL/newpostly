/**
 * Like Model
 * 
 * Handles all database operations related to post likes.
 */

const { pool } = require('../config/database');

class Like {
  /**
   * Check if user has liked a post
   */
  static async hasLiked(postId, userId) {
    const [rows] = await pool.execute(
      'SELECT like_id FROM post_likes WHERE post_id = ? AND user_id = ?',
      [postId, userId]
    );
    return rows.length > 0;
  }

  /**
   * Add a like to a post
   */
  static async addLike(postId, userId) {
    try {
      // Insert like record
      await pool.execute(
        'INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)',
        [postId, userId]
      );
      
      // Increment likes_count in posts table
      await pool.execute(
        'UPDATE posts SET likes_count = likes_count + 1 WHERE post_id = ?',
        [postId]
      );
      
      return true;
    } catch (error) {
      // If duplicate like (UNIQUE constraint), return false
      if (error.code === 'ER_DUP_ENTRY') {
        return false;
      }
      throw error;
    }
  }

  /**
   * Remove a like from a post
   */
  static async removeLike(postId, userId) {
    const [result] = await pool.execute(
      'DELETE FROM post_likes WHERE post_id = ? AND user_id = ?',
      [postId, userId]
    );
    
    if (result.affectedRows > 0) {
      // Decrement likes_count in posts table
      await pool.execute(
        'UPDATE posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE post_id = ?',
        [postId]
      );
      return true;
    }
    
    return false;
  }

  /**
   * Get like count for a post
   */
  static async getLikeCount(postId) {
    const [rows] = await pool.execute(
      'SELECT COUNT(*) as count FROM post_likes WHERE post_id = ?',
      [postId]
    );
    return rows[0].count;
  }

  /**
   * Get all users who liked a post
   */
  static async getLikers(postId) {
    const [rows] = await pool.execute(
      `SELECT u.user_id, u.username, u.email 
       FROM post_likes pl
       JOIN users u ON pl.user_id = u.user_id
       WHERE pl.post_id = ?
       ORDER BY pl.created_at DESC`,
      [postId]
    );
    return rows;
  }
}

module.exports = Like;

