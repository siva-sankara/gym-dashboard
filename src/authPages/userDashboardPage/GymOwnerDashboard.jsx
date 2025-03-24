import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './GymOwnerDashboard.css';

 function GymOwnerDashboard() {
  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <nav className="dashboard-nav">
          <Link to="manage-users">Manage Users</Link>
          <Link to="manage-trainers">Manage Trainers</Link>
          <Link to="subscriptions">Subscriptions</Link>
          <Link to="add-gym">Add New Gym</Link>
        </nav>
      </aside>

      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}
export default GymOwnerDashboard;