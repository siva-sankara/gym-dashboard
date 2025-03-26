import React, { useState, useEffect, useRef } from 'react';
import AuthNavbar from '../authNavbar/AuthNavbar';
import './DashboardLayout.css';
import { showToast } from '../../components/toast/Toast';

const DashboardLayout = ({ children }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const logoutButtonRef = useRef(null);
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    if (showLogoutModal && logoutButtonRef.current) {
      logoutButtonRef.current.focus();
    }
  }, [showLogoutModal]);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.click();
    } else if (e.key === 'Escape') {
      setShowLogoutModal(false);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      if (document.activeElement === logoutButtonRef.current) {
        cancelButtonRef.current.focus();
      } else if (document.activeElement === cancelButtonRef.current) {
        logoutButtonRef.current.focus();
      }
    }
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    showToast({
      type: 'success',
      message: 'Logged out successfully!',
      playSound: true
    });
    window.location.href = '/';
    setShowLogoutModal(false);
  };

  return (
    <div className="dashboard-container">
      <AuthNavbar onLogout={handleLogoutClick} />
      <div className="dashboard-main">
        <div className="dashboard-content">
          {children}
        </div>
      </div>
      {showLogoutModal && (
        <div className="modal-overlay">
          <div 
            className="modal-content"
            onKeyDown={handleKeyDown}
          >
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="modal-actions">
              <button 
                ref={cancelButtonRef}
                className="modal-button modal-button--cancel" 
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button 
                ref={logoutButtonRef}
                className="modal-button modal-button--confirm" 
                onClick={confirmLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;