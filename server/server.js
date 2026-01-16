/**
 * Postly Backend Server
 * 
 * Main server file that sets up Express application,
 * middleware, routes, and starts the server.
 * 
 * This is a Node.js backend for the Postly blog platform,
 * built with Express.js and MySQL for CSCI426 Phase 2.
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { testConnection } = require('./config/database');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const likeRoutes = require('./routes/likeRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// Middleware Configuration
// ============================================

// CORS configuration - allows React frontend to communicate with backend
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001'
].filter(Boolean); // Remove undefined values

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In production, check against allowed origins
    if (process.env.NODE_ENV === 'production') {
      if (allowedOrigins.some(allowed => origin.startsWith(allowed) || origin === allowed)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    } else {
      // In development, allow all origins
      callback(null, true);
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parser middleware - parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (for development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// ============================================
// API Routes
// ============================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Postly API is running',
    timestamp: new Date().toISOString()
  });
});

// Database setup endpoint (temporary - remove after setup)
app.get('/api/setup-database', async (req, res) => {
  try {
    const { setupDatabase } = require('./scripts/setup-schema');
    const bcrypt = require('bcrypt');
    
    // Setup schema
    await setupDatabase();
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await require('./config/database').pool.execute(
      `INSERT INTO users (username, email, password, role) 
       VALUES (?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE password = VALUES(password)`,
      ['admin', 'admin@postly.com', hashedPassword, 'admin']
    );
    
    // Create categories
    const categories = ['Technology', 'Lifestyle', 'Education'];
    for (const cat of categories) {
      await require('./config/database').pool.execute(
        'INSERT IGNORE INTO categories (category_name) VALUES (?)',
        [cat]
      );
    }
    
    res.json({
      success: true,
      message: 'Database initialized successfully!',
      credentials: {
        email: 'admin@postly.com',
        password: 'admin123'
      }
    });
  } catch (error) {
    console.error('Setup error:', error);
    res.status(500).json({
      success: false,
      message: 'Database setup failed',
      error: error.message
    });
  }
});

// API route handlers
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/posts', likeRoutes); // Like routes (uses /api/posts/:id/like)
app.use('/api/comments', commentRoutes);
app.use('/api/categories', categoryRoutes);

// ============================================
// Error Handling Middleware
// ============================================

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// ============================================
// Server Startup
// ============================================

const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('⚠️  Warning: Database connection failed. Server will start but database operations will fail.');
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║   Postly Backend Server                ║
║   Server running on port ${PORT}              ║
║   Environment: ${process.env.NODE_ENV || 'development'.padEnd(19)}║
╚════════════════════════════════════════╝
      `);
      console.log(`📡 API available at: http://localhost:${PORT}/api`);
      console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = app;

