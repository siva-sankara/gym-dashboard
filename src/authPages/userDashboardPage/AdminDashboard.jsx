import React, { useState } from 'react';
import {  FaUsers, FaDumbbell, FaChartLine, FaSearch } from 'react-icons/fa';
import './AdminDashboard.css';
import { Link } from 'react-router-dom';

 function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const stats = {
    totalGyms: 45,
    activeUsers: 1200,
    totalTrainers: 89,
    revenue: 150000
  };

  const recentActivities = [
    { id: 1, type: 'New Gym', name: 'FitLife Center', date: '2024-01-20' },
    { id: 2, type: 'New Trainer', name: 'John Smith', date: '2024-01-19' },
    // Add more activities
  ];

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="admin-nav">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <Link to=''><FaChartLine /> Overview</Link>
          </button>
          <button 
            className={`nav-item ${activeTab === 'gyms' ? 'active' : ''}`}
            onClick={() => setActiveTab('gyms')}
          >
            <FaUsers /> Manage Gyms
          </button>
          <button 
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <FaUsers /> Manage Users
          </button>
          <button 
            className={`nav-item ${activeTab === 'trainers' ? 'active' : ''}`}
            onClick={() => setActiveTab('trainers')}
          >
            <FaDumbbell /> Manage Trainers
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <FaUsers className="stat-icon" />
            <div className="stat-info">
              <h3>Total Gyms</h3>
              <p>{stats.totalGyms}</p>
            </div>
          </div>
          <div className="stat-card">
            <FaUsers className="stat-icon" />
            <div className="stat-info">
              <h3>Active Users</h3>
              <p>{stats.activeUsers}</p>
            </div>
          </div>
          <div className="stat-card">
            <FaDumbbell className="stat-icon" />
            <div className="stat-info">
              <h3>Total Trainers</h3>
              <p>{stats.totalTrainers}</p>
            </div>
          </div>
          <div className="stat-card">
            <FaChartLine className="stat-icon" />
            <div className="stat-info">
              <h3>Total Revenue</h3>
              <p>${stats.revenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="recent-activities">
          <h2>Recent Activities</h2>
          <div className="activity-list">
            {recentActivities.map(activity => (
              <div key={activity.id} className="activity-card">
                <div className="activity-icon">
                  {activity.type === 'New Gym' ? <FaUsers /> : <FaUsers />}
                </div>
                <div className="activity-info">
                  <h3>{activity.name}</h3>
                  <p>{activity.type}</p>
                  <span>{activity.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;