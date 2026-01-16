# Postly Backend Structure

## 📁 Directory Structure

```
server/
├── server.js                    # Main entry point
├── package.json                 # Dependencies
├── env.example                  # Environment variables template
│
├── config/                      # Configuration
│   ├── database.js              # MySQL connection
│   ├── db-schema.sql            # Database schema
│   └── likes-table.sql          # Likes table schema
│
├── models/                      # Data Access Layer
│   ├── User.js                  # User database operations
│   ├── Post.js                  # Post database operations
│   ├── Comment.js               # Comment database operations
│   ├── Category.js              # Category database operations
│   └── Like.js                  # Like database operations
│
├── controllers/                 # Business Logic Layer
│   ├── authController.js        # Authentication logic
│   ├── postController.js        # Post operations logic
│   ├── commentController.js     # Comment operations logic
│   ├── categoryController.js    # Category operations logic
│   └── likeController.js        # Like operations logic
│
├── routes/                      # API Routes
│   ├── authRoutes.js            # Auth endpoints
│   ├── postRoutes.js            # Post endpoints
│   ├── commentRoutes.js        # Comment endpoints
│   ├── categoryRoutes.js       # Category endpoints
│   └── likeRoutes.js           # Like endpoints
│
├── middleware/                  # Custom Middleware
│   ├── auth.js                  # JWT authentication
│   └── validation.js            # Input validation
│
└── scripts/                     # Utility Scripts
    ├── seed.js                  # Database seeding
    ├── generate-likes.js        # Generate random likes
    └── generate-comments.js     # Generate sample comments
```

## 🏗️ Architecture Pattern

The backend follows **MVC (Model-View-Controller)** architecture:

- **Models**: Handle all database operations (queries, inserts, updates, deletes)
- **Controllers**: Handle HTTP requests, business logic, and responses
- **Routes**: Define API endpoints and connect them to controllers
- **Middleware**: Handle authentication, validation, and other cross-cutting concerns

## 📦 Key Files Explained

### `server.js`
- Main entry point
- Sets up Express app
- Configures middleware (CORS, body parser, etc.)
- Registers all routes
- Starts the server
- Handles errors

### `config/database.js`
- Creates MySQL connection pool
- Exports pool for use in models
- Handles connection errors

### `models/`
- **User.js**: User CRUD operations
- **Post.js**: Post CRUD operations, search, likes
- **Comment.js**: Comment CRUD operations
- **Category.js**: Category CRUD operations
- **Like.js**: Like/unlike operations, check like status

### `controllers/`
- **authController.js**: 
  - `register()` - Create new user
  - `login()` - Authenticate user
  - `getCurrentUser()` - Get logged-in user info
  
- **postController.js**:
  - `createPost()` - Create new post
  - `getAllPosts()` - Get all posts (with filters)
  - `getPostById()` - Get single post
  - `updatePost()` - Update post (admin or owner)
  - `deletePost()` - Delete post (admin or owner)

- **commentController.js**:
  - `createComment()` - Add comment to post
  - `getCommentsByPost()` - Get all comments for a post
  - `updateComment()` - Update comment (admin or owner)
  - `deleteComment()` - Delete comment (admin or owner)

- **categoryController.js**:
  - `getAllCategories()` - Get all categories
  - `getCategoryById()` - Get single category
  - `createCategory()` - Create category (admin only)

- **likeController.js**:
  - `toggleLike()` - Like/unlike a post
  - `checkLike()` - Check if user liked a post
  - `getLikers()` - Get all users who liked a post

### `routes/`
- Define API endpoints
- Apply middleware (authentication, validation)
- Connect endpoints to controller functions

### `middleware/`
- **auth.js**: 
  - `authenticateToken()` - Verifies JWT token
  - Extracts user info from token
  
- **validation.js**:
  - `validateRegister()` - Validate registration data
  - `validateLogin()` - Validate login data
  - `validatePost()` - Validate post data
  - `validateComment()` - Validate comment data

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Posts
- `GET /api/posts` - Get all posts (with optional filters)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (protected)
- `PUT /api/posts/:id` - Update post (protected, admin or owner)
- `DELETE /api/posts/:id` - Delete post (protected, admin or owner)

### Comments
- `GET /api/comments/posts/:postId/comments` - Get comments for post
- `POST /api/comments/posts/:postId/comments` - Add comment (protected)
- `PUT /api/comments/:id` - Update comment (protected, admin or owner)
- `DELETE /api/comments/:id` - Delete comment (protected, admin or owner)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category (protected, admin only)

### Likes
- `POST /api/posts/:id/like` - Toggle like (protected)
- `GET /api/posts/:id/like` - Check like status (protected)
- `GET /api/posts/:id/likers` - Get all likers

## 🔐 Security Features

1. **JWT Authentication**: Token-based authentication
2. **Password Hashing**: bcrypt for secure password storage
3. **Input Validation**: Validates all user inputs
4. **Role-Based Access**: Admin vs regular user permissions
5. **CORS**: Configured for frontend communication
6. **SQL Injection Prevention**: Prepared statements in all queries

## 📊 Database Schema

### Tables
1. **users** - User accounts (username, email, password, role)
2. **posts** - Blog posts (title, text, category, likes_count)
3. **comments** - Comments on posts
4. **categories** - Post categories
5. **post_likes** - Tracks which users liked which posts

## 🚀 Scripts

- `node scripts/seed.js` - Seed database with admin user and sample posts
- `node scripts/generate-likes.js` - Generate random likes for posts
- `node scripts/generate-comments.js` - Generate sample comments

## 📝 Environment Variables (.env)

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=postly_db
JWT_SECRET=your_secret_key
```

## 🔄 Request Flow

1. **Request** → Route
2. **Route** → Middleware (auth, validation)
3. **Middleware** → Controller
4. **Controller** → Model (database operations)
5. **Model** → Database
6. **Response** ← Controller ← Model
7. **Response** → Client

## 📚 Dependencies

- **express**: Web framework
- **mysql2**: MySQL database driver
- **jsonwebtoken**: JWT authentication
- **bcrypt**: Password hashing
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variables

