import React from 'react';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';

const BlogCard = ({ post }) => {
  const truncateText = (text, maxLength = 200) => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  const stripHtml = (html = '') =>
    DOMPurify.sanitize(html, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });

  const coverSrc = post.cover_url
    ? (typeof post.cover_url === 'string' && post.cover_url.startsWith('http')
        ? post.cover_url
        : `http://localhost/upload/blog/${post.cover_url}`)
    : 'https://via.placeholder.com/800x300?text=Blog+Post';

  return (
    <div className="card main-blog-card mb-5 fade-in">4
      <img
        src={coverSrc}
        className="card-img-top"
        alt={post.post_title}
        style={{ height: '300px', objectFit: 'cover' }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://via.placeholder.com/800x300?text=Blog+Post';
        }}
      />
      <div className="card-body">
        <h5 className="card-title">{post.post_title}</h5>
        <p className="card-text text-muted">
          {truncateText(stripHtml(post.post_text || ''))}
        </p>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <small className="text-body-secondary">
            {new Date(post.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </small>
          <div className="react-btns">
            <i className="fa fa-thumbs-up me-2" aria-hidden="true"></i>
            <span className="me-3">{post.likes_count || 0} Likes</span>
            <i className="fa fa-comment me-2" aria-hidden="true"></i>
            <span>{post.comments_count || 0} Comments</span>
          </div>
        </div>
        <Link to={`/blog/${post.post_id}`} className="btn btn-primary">
          Read More
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;

