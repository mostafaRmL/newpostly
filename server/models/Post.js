/**
 * Post Model
 * 
 * Handles all database operations related to blog posts.
 * Includes methods for CRUD operations and search functionality.
 */

const { pool } = require('../config/database');

class Post {
  /**
   * Create a new post
   */
  static async create(userId, postData) {
    const { post_title, post_text, category_id, cover_url } = postData;
    
    const [result] = await pool.execute(
      `INSERT INTO posts (user_id, category_id, post_title, post_text, cover_url) 
       VALUES (?, ?, ?, ?, ?)`,
      [userId, category_id || null, post_title, post_text, cover_url || null]
    );
    
    return result.insertId;
  }

  /**
   * Get all posts with user and category information
   */
  static async findAll(options = {}) {
    let query = `
      SELECT 
        p.post_id,
        p.post_title,
        p.post_text,
        p.cover_url,
        p.likes_count,
        p.created_at,
        p.updated_at,
        p.category_id,
        c.category_name,
        u.user_id,
        u.username,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.post_id) as comments_count
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN users u ON p.user_id = u.user_id
    `;

    const params = [];

    // Add category filter if provided
    if (options.category_id) {
      query += ' WHERE p.category_id = ?';
      params.push(options.category_id);
    }

    // Add search filter if provided
    if (options.search) {
      const searchCondition = ' WHERE MATCH(p.post_title, p.post_text) AGAINST(? IN NATURAL LANGUAGE MODE)';
      if (options.category_id) {
        query = query.replace(' WHERE p.category_id = ?', searchCondition + ' AND p.category_id = ?');
        params.unshift(options.search);
      } else {
        query += searchCondition;
        params.push(options.search);
      }
    }

    // Order by created_at descending (newest first)
    query += ' ORDER BY p.created_at DESC';

    // Add pagination if provided
    if (options.limit) {
      query += ' LIMIT ?';
      params.push(options.limit);
      
      if (options.offset) {
        query += ' OFFSET ?';
        params.push(options.offset);
      }
    }

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  /**
   * Get a single post by ID with full details
   */
  static async findById(postId) {
    const [rows] = await pool.execute(
      `SELECT 
        p.post_id,
        p.post_title,
        p.post_text,
        p.cover_url,
        p.likes_count,
        p.created_at,
        p.updated_at,
        p.category_id,
        c.category_name,
        u.user_id,
        u.username,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.post_id) as comments_count
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN users u ON p.user_id = u.user_id
      WHERE p.post_id = ?`,
      [postId]
    );
    return rows[0] || null;
  }

  /**
   * Update a post
   */
  static async update(postId, userId, updates, userRole = 'user') {
    const allowedFields = ['post_title', 'post_text', 'category_id', 'cover_url'];
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key) && value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) {
      return false;
    }

    // Check if post exists
    const post = await this.findById(postId);
    if (!post) {
      return false;
    }

    // Build WHERE clause - admins can edit any post, users can only edit their own
    let whereClause = 'WHERE post_id = ?';
    values.push(postId);
    
    if (userRole !== 'admin') {
      whereClause += ' AND user_id = ?';
      values.push(userId);
    }

    const [result] = await pool.execute(
      `UPDATE posts SET ${fields.join(', ')} ${whereClause}`,
      values
    );
    
    return result.affectedRows > 0;
  }

  /**
   * Delete a post
   */
  static async delete(postId, userId, userRole = 'user') {
    let query = 'DELETE FROM posts WHERE post_id = ?';
    const params = [postId];

    // Only allow users to delete their own posts (unless admin)
    if (userRole !== 'admin') {
      query += ' AND user_id = ?';
      params.push(userId);
    }

    const [result] = await pool.execute(query, params);
    return result.affectedRows > 0;
  }

  /**
   * Increment likes count
   */
  static async incrementLikes(postId) {
    const [result] = await pool.execute(
      'UPDATE posts SET likes_count = likes_count + 1 WHERE post_id = ?',
      [postId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Post;

