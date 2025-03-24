import React from 'react';
import AuthNavbar from '../authNavbar/AuthNavbar';
import './DashboardLayout.css';

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-container">
      <AuthNavbar />
      <div className="dashboard-main">
        <div className="dashboard-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;