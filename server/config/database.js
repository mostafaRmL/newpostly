/**
 * Database Configuration
 * 
 * This module handles MySQL database connection using mysql2.
 * We chose mysql2 over Sequelize because:
 * 1. It's lighter and more straightforward for this project
 * 2. Direct SQL queries give better control and understanding
 * 3. No need for complex ORM features for a university project
 * 4. Better performance for simple CRUD operations
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

if (process.env.NODE_ENV !== 'production') {
  console.log('DB_HOST:', process.env.DB_HOST || 'undefined');
}

// Parse database connection from MYSQL_URL or individual variables
let dbConfig = {};

if (process.env.MYSQL_URL) {
  // Parse MYSQL_URL format: mysql://user:password@host:port/database
  const url = new URL(process.env.MYSQL_URL);
  dbConfig = {
    host: url.hostname,
    port: parseInt(url.port) || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1) // Remove leading '/'
  };
} else {
  // Use individual variables (fallback)
  dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'postly_db'
  };
}

// Create connection pool for better performance and connection management
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

module.exports = { pool, testConnection };

