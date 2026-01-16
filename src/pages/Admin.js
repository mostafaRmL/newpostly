import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiService } from '../services/api';

const Admin = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in and is admin
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      setCurrentUser(user);

      if (user.role !== 'admin') {
        alert('Access denied. Admin privileges required.');
        navigate('/');
        return;
      }

      fetchData();
    } catch (e) {
      console.error('Error parsing user data:', e);
      navigate('/login');
    }
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [postsData, categoriesData] = await Promise.all([
        apiService.getPosts(),
        apiService.getCategories()
      ]);
      setPosts(postsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await apiService.deletePost(postId);
      alert('Post deleted successfully!');
      fetchData();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. ' + (error.message || 'Please try again.'));
    }
  };

  if (loading) {
    return (
      <div className="container page-container">
        <div className="spinner-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="display-4">Admin Dashboard</h1>
        <Link to="/blog" className="btn btn-outline-primary">
          <i className="fas fa-arrow-left me-1"></i> Back to Blog
        </Link>
      </div>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Total Posts</h5>
              <h2 className="text-primary">{posts.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Categories</h5>
              <h2 className="text-success">{categories.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Admin User</h5>
              <p className="mb-0">{currentUser?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="mb-0">All Posts</h3>
        </div>
        <div className="card-body">
          {posts.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.post_id}>
                      <td>{post.post_id}</td>
                      <td>
                        <Link to={`/blog/${post.post_id}`}>
                          {post.post_title}
                        </Link>
                      </td>
                      <td>{post.username || 'Unknown'}</td>
                      <td>{post.category_name || 'Uncategorized'}</td>
                      <td>
                        {new Date(post.created_at).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Link
                            to={`/blog/${post.post_id}/edit`}
                            className="btn btn-sm btn-outline-primary"
                          >
                            <i className="fas fa-edit"></i>
                          </Link>
                          <button
                            onClick={() => handleDeletePost(post.post_id)}
                            className="btn btn-sm btn-outline-danger"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-info">
              No posts found. <Link to="/blog">Create your first post</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;

