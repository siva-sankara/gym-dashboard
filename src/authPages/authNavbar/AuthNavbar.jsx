import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaDumbbell, FaUsers, FaCalendar, FaCog, FaBars, FaTimes, FaChartLine, FaClipboardList, FaUserCog,FaCalendarCheck, FaDollarSign } from 'react-icons/fa';
import './AuthNavbar.css';

const AuthNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role || '');
  }, []);
  const isActivePath = (path) => {
    const currentPath = location.pathname.replace(/\/$/, '');
    
    // For user dashboard home page
    if (path === '/user-dashboard' && currentPath === '/user-dashboard') {
      return true;
    }
  
    // For nested routes under user-dashboard
    if (path.includes('/user-dashboard/')) {
      return currentPath === path;
    }
  
    // For other direct routes
    return currentPath === path;
  };
  
  const handleNavClick = (e, path) => {
    e.preventDefault();
    if (!isActivePath(path)) {
      navigate(path);
    }
    setIsOpen(false);
  };

  const getNavItems = () => {
    switch (userRole) {
      case 'admin':
        return [
          { to: '/dashboard', icon: <FaChartLine />, text: 'Dashboard' },
          { to: '/gyms', icon: <FaDumbbell />, text: 'Gyms' },
          { to: '/all-users', icon: <FaUsers />, text: 'Users' },
          { to: '/settings', icon: <FaUserCog />, text: 'Settings' }
        ];
      case 'gym-owner':
        return [
          { to: '/dashboard', icon: <FaChartLine />, text: 'Dashboard' },
          { to: '/members', icon: <FaUsers />, text: 'Members' },
          { to: '/trainers', icon: <FaUsers />, text: 'Trainers' },
          { to: '/subscriptions', icon: <FaDollarSign />, text: 'Subscriptions' },
          { to: '/settings', icon: <FaUserCog />, text: 'Settings' }
        ];
      case 'trainer':
        return [
          { to: '/dashboard', icon: <FaChartLine />, text: 'Dashboard' },
          { to: '/my-clients', icon: <FaUsers />, text: 'My Clients' },
          { to: '/schedule', icon: <FaCalendar />, text: 'Schedule' },
          { to: '/workout-plans', icon: <FaClipboardList />, text: 'Workout Plans' },
          { to: '/profile', icon: <FaUserCog />, text: 'Profile' }
        ];
      case 'user':
        return [
          { to: '/user-dashboard', icon: <FaChartLine />, text: 'Home' },
          { to: '/user-dashboard/nearby-gyms', icon: <FaDumbbell />, text: 'Near By Gyms' },
          { to: '/user-dashboard/to-dos', icon: <FaCalendarCheck />, text: "To Do's" },
          { to: '/register-new-gym', icon: <FaCalendar />, text: 'Register Your Gym' },
          { to: '/profile', icon: <FaUserCog />, text: 'Profile' }
        ];
      default:
        return [];
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="role-navbar">
    <div className="role-navbar__brand">
      <FaDumbbell className="role-navbar__logo-icon" />
      <span className="role-navbar__logo-text">GymFit</span>
    </div>

    <button className="role-navbar__toggle" onClick={toggleMenu}>
      {isOpen ? <FaTimes /> : <FaBars />}
    </button>

    <div className={`role-navbar__menu ${isOpen ? 'role-navbar__menu--active' : ''}`}>
      {getNavItems().map((item, index) => (
        <a 
          key={index} 
          href={item.to}
          className={`role-navbar__link ${isActivePath(item.to) ? 'role-navbar__link--active' : ''}`}
          onClick={(e) => handleNavClick(e, item.to)}
        >
          <span className="role-navbar__link-icon">{item.icon}</span>
          <span className="role-navbar__link-text">{item.text}</span>
        </a>
      ))}
    </div>
  </nav>
  );
};

export default AuthNavbar;