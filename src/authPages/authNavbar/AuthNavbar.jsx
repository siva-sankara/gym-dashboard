import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaDumbbell,
  FaUsers,
  FaCalendar,
  FaCog,
  FaBars,
  FaTimes,
  FaChartLine,
  FaClipboardList,
  FaUserCog,
  FaCalendarCheck,
  FaDollarSign,
  FaUserCircle,
  FaSignOutAlt,
  FaCreditCard,
  FaEdit,
  FaBell
} from 'react-icons/fa';
import './AuthNavbar.css';


const AuthNavbar = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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

  const handleLogout = (e) => {
    e.preventDefault();
    onLogout();
  };
  const handleProfileClick = (e) => {
    e.preventDefault();
    if (window.innerWidth <= 768) {
      setIsProfileOpen(!isProfileOpen);
    }
  };


  const handleNavClick = (e, path) => {
    e.preventDefault();
    if (!isActivePath(path)) {
      navigate(path);
    }
    setIsOpen(false);
  };
  // Add this function before the return statement
  const getProfileDropdownItems = () => {
    return [
      { to: '/profile/view', icon: <FaUserCircle />, text: 'User Profile' },
      { to: '/profile/notifications', icon: <FaBell />, text: 'Notifications' },
      { to: '/profile/edit', icon: <FaEdit />, text: 'Edit Profile' },
      { to: '/profile/settings', icon: <FaCog />, text: 'Settings' },
      { to: '/profile/subscriptions', icon: <FaCreditCard />, text: 'Your Subscriptions' },
      {
        to: '/logout',
        icon: <FaSignOutAlt />,
        text: 'Logout',
        onClick: handleLogout
      }
    ];
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
      case 'user':
        return [
          { to: '/user-dashboard', icon: <FaChartLine />, text: 'Dashboard' },
          { to: '/user-dashboard/nearby-gyms', icon: <FaDumbbell />, text: 'Explore Gyms' },
          { to: '/user-dashboard/to-dos', icon: <FaCalendarCheck />, text: 'Workout Planner' },
          { to: '/user-dashboard/register-gym', icon: <FaCalendar />, text: 'List Your Gym' },
          {
            to: '#',
            icon: <FaUserCog />,
            text: 'My Account',
            hasDropdown: true,
            dropdownItems: getProfileDropdownItems(),
            onClick: handleProfileClick
          }
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
          <div key={index} className="role-navbar__link-container">
            <a
              href={item.to}
              className={`role-navbar__link ${isActivePath(item.to) ? 'role-navbar__link--active' : ''}`}
              onClick={(e) => item.onClick ? item.onClick(e) : handleNavClick(e, item.to)}
              onMouseEnter={() => item.hasDropdown && setIsProfileOpen(true)}
            >
              <span className="role-navbar__link-icon">{item.icon}</span>
              <span className="role-navbar__link-text">{item.text}</span>
            </a>
            {item.hasDropdown && isProfileOpen && (
              <div
                className="role-navbar__dropdown"
                onMouseLeave={() => setIsProfileOpen(false)}
              >
                {item.dropdownItems.map((dropdownItem, dropIndex) => (
                  <a
                    key={dropIndex}
                    href={dropdownItem.to}
                    className="role-navbar__dropdown-item"
                    onClick={(e) => dropdownItem.onClick ? dropdownItem.onClick(e) : handleNavClick(e, dropdownItem.to)}
                  >
                    <span className="role-navbar__dropdown-icon">{dropdownItem.icon}</span>
                    <span className="role-navbar__dropdown-text">{dropdownItem.text}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};

export default AuthNavbar;