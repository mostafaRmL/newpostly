import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiService } from '../services/api';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [postData, setPostData] = useState({
    post_title: '',
    post_text: '',
    category_id: '',
    cover_url: ''
  });

  useEffect(() => {
    fetchPost();
    fetchCategories();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const post = await apiService.getPostById(id);
      setPostData({
        post_title: post.post_title || '',
        post_text: post.post_text || '',
        category_id: post.category_id || '',
        cover_url: post.cover_url || ''
      });
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Failed to load post. You may not have permission to edit it.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await apiService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (!postData.post_title.trim() || !postData.post_text.trim()) {
      setError('Title and content are required');
      setSubmitting(false);
      return;
    }

    try {
      await apiService.updatePost(id, postData);
      navigate(`/blog/${id}`);
    } catch (error) {
      console.error('Error updating post:', error);
      setError(error.message || 'Failed to update post. Please try again.');
    } finally {
      setSubmitting(false);
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
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h2 className="mb-0">Edit Post</h2>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="post_title" className="form-label">
                    Post Title <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="post_title"
                    name="post_title"
                    value={postData.post_title}
                    onChange={handleChange}
                    required
                    maxLength={255}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="category_id" className="form-label">
                    Category
                  </label>
                  <select
                    className="form-select"
                    id="category_id"
                    name="category_id"
                    value={postData.category_id}
                    onChange={handleChange}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="post_text" className="form-label">
                    Content <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    id="post_text"
                    name="post_text"
                    rows="15"
                    value={postData.post_text}
                    onChange={handleChange}
                    required
                  />
                  <small className="form-text text-muted">
                    You can use HTML tags for formatting
                  </small>
                </div>

                <div className="mb-3">
                  <label htmlFor="cover_url" className="form-label">
                    Cover Image URL (optional)
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    id="cover_url"
                    name="cover_url"
                    value={postData.cover_url}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Updating...
                      </>
                    ) : (
                      'Update Post'
                    )}
                  </button>
                  <Link to={`/blog/${id}`} className="btn btn-secondary">
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPost;

