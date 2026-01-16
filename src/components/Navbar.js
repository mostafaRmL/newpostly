import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  useEffect(() => {
    // Function to update user state
    const updateUser = () => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          setCurrentUser(JSON.parse(userStr));
        } catch (e) {
          console.error('Error parsing user data:', e);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    };

    // Update user on mount and when location changes (e.g., after login)
    updateUser();

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = () => {
      updateUser();
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [location]); // Re-run when location changes

  const handleLogout = () => {
    apiService.logout();
    setCurrentUser(null);
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm" style={{ backgroundColor: '#1877F2' }}>
      <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
          <img 
            src="/logo.png" 
            alt="Postly" 
            style={{ height: '160px', width: 'auto', objectFit: 'contain' }}
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive('/')}`}
                to="/"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive('/blog')}`}
                to="/blog"
                onClick={() => setIsOpen(false)}
              >
                Blog
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive('/about')}`}
                to="/about"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive('/services')}`}
                to="/services"
                onClick={() => setIsOpen(false)}
              >
                Services
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive('/contact')}`}
                to="/contact"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
            </li>
          </ul>
          <div className="d-flex gap-2 align-items-center">
            {currentUser ? (
              <>
                {currentUser.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="btn btn-warning"
                    onClick={() => setIsOpen(false)}
                    style={{ 
                      padding: '0.5rem 1.5rem',
                      fontWeight: '500',
                      borderRadius: '0.5rem'
                    }}
                  >
                    <i className="fas fa-cog me-1"></i> Admin
                  </Link>
                )}
                <div className="dropdown">
                  <button
                    className="btn btn-outline-light dropdown-toggle"
                    type="button"
                    id="userMenu"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ 
                      padding: '0.5rem 1.5rem',
                      fontWeight: '500',
                      borderRadius: '0.5rem'
                    }}
                  >
                    <i className="fas fa-user me-1"></i> {currentUser.username}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu">
                    <li>
                      <span className="dropdown-item-text">
                        <small className="text-muted">Logged in as</small><br />
                        <strong>{currentUser.email}</strong>
                      </span>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={handleLogout}
                      >
                        <i className="fas fa-sign-out-alt me-2"></i> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="btn btn-outline-light"
                onClick={() => setIsOpen(false)}
                style={{ 
                  padding: '0.5rem 1.5rem',
                  fontWeight: '500',
                  borderRadius: '0.5rem'
                }}
              >
                Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


