import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import '../styles/Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!loginData.email || !loginData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await apiService.login(loginData.email, loginData.password);
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!signupData.username || !signupData.email || !signupData.password || !signupData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (signupData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      await apiService.register(signupData.username, signupData.email, signupData.password);
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-card">
          <h1 className="auth-title">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="auth-subtitle">
            {isLogin 
              ? 'Sign in to your Postly account' 
              : 'Join Postly and start sharing'}
          </p>

          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setError('')}
              ></button>
            </div>
          )}

          {success && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {success}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setSuccess('')}
              ></button>
            </div>
          )}

          {isLogin ? (
            // Login Form
            <form onSubmit={handleLogin} className="auth-form">
              <div className="form-group mb-3">
                <label htmlFor="loginEmail" className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  id="loginEmail"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="loginPassword" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="loginPassword"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  placeholder="Enter your password"
                  disabled={loading}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-100 mb-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          ) : (
            // Signup Form
            <form onSubmit={handleSignup} className="auth-form">
              <div className="form-group mb-3">
                <label htmlFor="signupUsername" className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="signupUsername"
                  name="username"
                  value={signupData.username}
                  onChange={handleSignupChange}
                  placeholder="Enter your full name"
                  disabled={loading}
                />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="signupEmail" className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  id="signupEmail"
                  name="email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="signupPassword" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="signupPassword"
                  name="password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  placeholder="Create a password (min 6 characters)"
                  disabled={loading}
                />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={signupData.confirmPassword}
                  onChange={handleSignupChange}
                  placeholder="Confirm your password"
                  disabled={loading}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-100 mb-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          )}

          <div className="auth-divider">
            <span>or</span>
          </div>

          <p className="auth-toggle text-center">
            {isLogin ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  className="auth-toggle-btn"
                  onClick={() => {
                    setIsLogin(false);
                    setError('');
                    setSuccess('');
                  }}
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  className="auth-toggle-btn"
                  onClick={() => {
                    setIsLogin(true);
                    setError('');
                    setSuccess('');
                  }}
                >
                  Sign In
                </button>
              </>
            )}
          </p>
        </div>

        <div className="auth-info">
          <h2>Why Choose Postly?</h2>
          <ul className="info-list">
            <li>
              <i className="fas fa-check-circle"></i>
              <span>Share your thoughts and stories</span>
            </li>
            <li>
              <i className="fas fa-check-circle"></i>
              <span>Connect with our community</span>
            </li>
            <li>
              <i className="fas fa-check-circle"></i>
              <span>Discover amazing content</span>
            </li>
            <li>
              <i className="fas fa-check-circle"></i>
              <span>Engage with comments and feedback</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Auth;
