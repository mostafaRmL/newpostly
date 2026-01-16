import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import EditPost from './pages/EditPost';
import Admin from './pages/Admin';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-wrapper d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-grow-1 main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/blog/:id/edit" element={<EditPost />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Auth />} />
            <Route
              path="*"
              element={
                <div className="container page-container text-center">
                  <h1 className="display-5 mb-3">Page Not Found</h1>
                  <p className="text-muted">
                    We can't find the page you are looking for.
                  </p>
                </div>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
