import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaDumbbell, FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
     <div className='logo-menu-con'>
     <button 
        className="navbar__toggle" 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle navigation"
      >
        {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20}/>}
      </button>
      <div className="navbar__brand">
        <FaDumbbell className="navbar__logo-icon" />
        <span className="navbar__logo-text">GymFit</span>
      </div>
     </div>

      

      <div className={`navbar__menu ${isMenuOpen ? 'navbar__menu--active' : ''}`}>
        <Link to="/" className={`navbar__link ${isActive('/') ? 'navbar__link--active' : ''}`}>
          Home
        </Link>
        <Link to="/about" className={`navbar__link ${isActive('/about') ? 'navbar__link--active' : ''}`}>
        Services
        </Link>
        
        <Link to="/contact" className={`navbar__link ${isActive('/contact') ? 'navbar__link--active' : ''}`}>
          Contact
        </Link>
      </div>

      <div className="navbar__auth">
        <Link 
          to="/login" 
          className={`navbar__auth-btn navbar__auth-btn--login ${isActive('/login') ? 'navbar__auth-btn--active' : ''}`}
        >
          Login
        </Link>
        <Link 
          to="/signup" 
          className={`navbar__auth-btn navbar__auth-btn--signup ${isActive('/signup') ? 'navbar__auth-btn--active' : ''}`}
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;