import React from 'react';
import './SideNav.css';

const SideNav = ({ activeItem, setActiveItem ,navItems }) => {
  

  return (
    <div className="sidenav">
      <div className="sidenav-header">
        <h2>Gym Dashboard</h2>
      </div>
      <nav className="nav-items">
        {navItems.map(item => (
          <div
            key={item.id}
            className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
            onClick={() => setActiveItem(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default SideNav;