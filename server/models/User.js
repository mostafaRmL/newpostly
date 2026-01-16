/**
 * User Model
 * 
 * Handles all database operations related to users.
 * Uses prepared statements to prevent SQL injection.
 */

const { pool } = require('../config/database');

class User {
  /**
   * Create a new user
   */
  static async create(username, email, hashedPassword, role = 'user') {
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, role]
    );
    return result.insertId;
  }

  /**
   * Find user by email
   */
  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  }

  /**
   * Find user by username
   */
  static async findByUsername(username) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    return rows[0] || null;
  }

  /**
   * Find user by ID
   */
  static async findById(userId) {
    const [rows] = await pool.execute(
      'SELECT user_id, username, email, role, created_at FROM users WHERE user_id = ?',
      [userId]
    );
    return rows[0] || null;
  }

  /**
   * Get user with password (for login verification)
   */
  static async findByEmailWithPassword(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  }

  /**
   * Update user information
   */
  static async update(userId, updates) {
    const allowedFields = ['username', 'email', 'password'];
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key) && value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) {
      return null;
    }

    values.push(userId);
    const [result] = await pool.execute(
      `UPDATE users SET ${fields.join(', ')} WHERE user_id = ?`,
      values
    );
    return result.affectedRows > 0;
  }

  /**
   * Delete user
   */
  static async delete(userId) {
    const [result] = await pool.execute(
      'DELETE FROM users WHERE user_id = ?',
      [userId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = User;

