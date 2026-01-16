import React from 'react';

const Footer = () => {
  return (
    <footer className="footer mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4 mb-md-0">
            <img 
              src="/logo.png" 
              alt="Postly" 
              className="mb-3"
              style={{ height: '100px', width: 'auto', objectFit: 'contain' }}
            />
            <p className="text-white-50">
              Share your thoughts, ideas, and stories with the world. 
              A platform for creative minds and passionate writers.
            </p>
          </div>
          <div className="col-md-4">
            <h5 className="text-white">Connect With Us</h5>
            <div className="d-flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white"
              >
                <i className="fa fa-facebook fa-2x"></i>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white"
              >
                <i className="fa fa-twitter fa-2x"></i>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white"
              >
                <i className="fa fa-instagram fa-2x"></i>
              </a>
            </div>
          </div>
        </div>
        <hr className="my-4" style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />
        <div className="text-center text-white-50">
          <p className="mb-0">&copy; {new Date().getFullYear()} Postly. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


