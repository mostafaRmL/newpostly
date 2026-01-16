/**
 * API Service
 * 
 * Connects the React frontend to the Node.js/Express backend.
 * All API calls use axios to communicate with the backend server.
 */

import axios from 'axios';

// Base URL for the backend API
// In production, set REACT_APP_API_URL environment variable
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Server responded with error status
      throw new Error(error.response.data.message || 'An error occurred');
    } else if (error.request) {
      // Request made but no response
      throw new Error('Network error. Please check if the backend server is running.');
    } else {
      // Something else happened
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);

export const apiService = {
  // ============================================
  // Authentication APIs
  // ============================================

  /**
   * Register a new user
   */
  register: async (username, email, password) => {
    const response = await api.post('/auth/register', {
      username,
      email,
      password,
    });
    // Store token in localStorage
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },

  /**
   * Login user
   */
  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    // Store token in localStorage
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },

  /**
   * Logout user (clear local storage)
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async () => {
    return await api.get('/auth/me');
  },

  // ============================================
  // Post APIs
  // ============================================

  /**
   * Get all blog posts
   * @param {Object} options - Optional filters (search, category_id, limit, offset)
   */
  getPosts: async (options = {}) => {
    const params = new URLSearchParams();
    if (options.search) params.append('search', options.search);
    if (options.category_id) params.append('category_id', options.category_id);
    if (options.limit) params.append('limit', options.limit);
    if (options.offset) params.append('offset', options.offset);

    const queryString = params.toString();
    const url = queryString ? `/posts?${queryString}` : '/posts';
    const response = await api.get(url);
    return response.data?.posts || [];
  },

  /**
   * Get a single post by ID
   */
  getPostById: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data?.post;
  },

  /**
   * Search posts
   */
  searchPosts: async (searchTerm) => {
    if (!searchTerm || !searchTerm.trim()) {
      return await apiService.getPosts();
    }
    return await apiService.getPosts({ search: searchTerm.trim() });
  },

  /**
   * Create a new post (requires authentication)
   */
  createPost: async (postData) => {
    const response = await api.post('/posts', postData);
    return response.data?.post;
  },

  /**
   * Update a post (requires authentication)
   */
  updatePost: async (postId, postData) => {
    const response = await api.put(`/posts/${postId}`, postData);
    return response.data?.post;
  },

  /**
   * Delete a post (requires authentication)
   */
  deletePost: async (postId) => {
    return await api.delete(`/posts/${postId}`);
  },

  // ============================================
  // Category APIs
  // ============================================

  /**
   * Get all categories
   */
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data?.categories || [];
  },

  /**
   * Get category by ID
   */
  getCategoryById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data?.category;
  },

  // ============================================
  // Comment APIs
  // ============================================

  /**
   * Get comments for a post
   */
  getComments: async (postId) => {
    const response = await api.get(`/comments/posts/${postId}/comments`);
    return response.data?.comments || [];
  },

  /**
   * Add a comment to a post (requires authentication)
   */
  addComment: async (postId, comment) => {
    const response = await api.post(`/comments/posts/${postId}/comments`, {
      comment,
    });
    return response.data?.comment;
  },

  /**
   * Update a comment (requires authentication)
   */
  updateComment: async (commentId, comment) => {
    const response = await api.put(`/comments/${commentId}`, { comment });
    return response.data?.comment;
  },

  /**
   * Delete a comment (requires authentication)
   */
  deleteComment: async (commentId) => {
    return await api.delete(`/comments/${commentId}`);
  },

  // ============================================
  // Like APIs
  // ============================================

  /**
   * Toggle like on a post (requires authentication)
   */
  toggleLike: async (postId) => {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  },

  /**
   * Check if current user has liked a post (requires authentication)
   */
  checkLike: async (postId) => {
    const response = await api.get(`/posts/${postId}/like`);
    return response.data?.liked || false;
  },

  /**
   * Get all users who liked a post
   */
  getLikers: async (postId) => {
    const response = await api.get(`/posts/${postId}/likers`);
    return response.data?.likers || [];
  },
};

