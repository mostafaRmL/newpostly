-- ============================================
-- Postly Database Schema
-- ============================================
-- This SQL script creates the database schema for the Postly blog platform.
-- It includes tables for Users, Posts, Comments, and Categories with
-- proper relationships, primary keys, and foreign keys.
-- ============================================

-- Create database (if it doesn't exist)
CREATE DATABASE IF NOT EXISTS postly_db;
USE postly_db;

-- ============================================
-- Table: users
-- Purpose: Store user account information
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL COMMENT 'Hashed password using bcrypt',
  role ENUM('user', 'admin') DEFAULT 'user' NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: categories
-- Purpose: Store blog post categories
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: posts
-- Purpose: Store blog posts
-- Relationships: 
--   - Many posts belong to one user (user_id FK)
--   - Many posts belong to one category (category_id FK)
-- ============================================
CREATE TABLE IF NOT EXISTS posts (
  post_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  category_id INT,
  post_title VARCHAR(255) NOT NULL,
  post_text TEXT NOT NULL,
  cover_url VARCHAR(500) NULL COMMENT 'URL or filename for post cover image',
  likes_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_category_id (category_id),
  INDEX idx_created_at (created_at),
  FULLTEXT INDEX idx_search (post_title, post_text)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: comments
-- Purpose: Store comments on blog posts
-- Relationships:
--   - Many comments belong to one post (post_id FK)
--   - Many comments belong to one user (user_id FK)
-- ============================================
CREATE TABLE IF NOT EXISTS comments (
  comment_id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_post_id (post_id),
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Insert Sample Data
-- ============================================

-- Insert default categories
INSERT INTO categories (category_name) VALUES
  ('Technology'),
  ('Lifestyle'),
  ('Education')
ON DUPLICATE KEY UPDATE category_name = category_name;

-- Insert a default admin user (password: admin123)
-- Password hash for 'admin123' using bcrypt (10 rounds)
-- In production, this should be changed immediately
INSERT INTO users (username, email, password, role) VALUES
  ('admin', 'admin@postly.com', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'admin')
ON DUPLICATE KEY UPDATE username = username;

-- Note: The admin password hash above is a placeholder.
-- In production, use bcrypt to generate a proper hash for your admin password.

