import React from 'react';
import { FaUsers, FaDumbbell, FaMoneyBillWave, FaCalendarCheck, FaChartLine, FaClipboardList, FaCog, FaMapMarkerAlt, FaBuilding, FaClipboard } from 'react-icons/fa';
import './GymOwnerDashboardOverView.css';
import { useSelector } from 'react-redux';

function GymOwnerDashboardOverView() {
  const { gymList, selectedGym } = useSelector((state) => state.gym);
  // Mock data (replace with real data from your backend)

  const stats = [
    {
      id: 1,
      title: 'My Gyms',
      value: gymList?.length || 1,
      subValue: 'Locations',
      icon: FaBuilding,
      color: '#2196F3',
      category: 'facilities'
    },
    {
      id: 2,
      title: 'Total Members',
      value: 245,
      subValue: '180 Active',
      icon: FaUsers,
      color: '#4CAF50',
      category: 'members'
    },
  
    {
      id: 3,
      title: 'Pending Requests From User',
      value: 5,
      subValue: 'Need Attention',
      icon: FaClipboard,
      color: '#FF9800',
      category: 'requests'
    },
    {
      id: 4,
      title: 'Trainers',
      value: 8,
      subValue: 'Active Trainers',
      icon: FaDumbbell,
      color: '#E91E63',
      category: 'staff'
    },
    {
      id: 5,
      title: 'Maintenance',
      value: 2,
      subValue: 'Scheduled',
      icon: FaCog,
      color: '#9C27B0',
      category: 'maintenance'
    },
    {
      id: 6,
      title: 'Monthly Revenue',
      value: '$12,500',
      subValue: 'This Month',
      icon: FaMoneyBillWave,
      color: '#4CAF50',
      category: 'finance'
    },
    
    {
      id: 7,
      title: 'Active Classes',
      value: 12,
      subValue: 'Running This Week',
      icon: FaCalendarCheck,
      color: '#3F51B5',
      category: 'classes'
    }
  ];

  return (
    <div className="dashboard-overview">
      <h1 className="overview-title">Dashboard Overview</h1>
      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.id} className="stat-card" style={{ borderTop: `3px solid ${stat.color}` }}>
            <div className="stat-icon" style={{ color: stat.color }}>
              <stat.icon />
            </div>
            <div className="stat-details">
              <h3>{stat.title}</h3>
              <p className="stat-number">{stat.value}</p>
              <span className="stat-label">{stat.subValue}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-sections">
        <div className="section-card recent-activities">
          <h2>Recent Activities</h2>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-time">2h ago</span>
              <p>New member registration - John Doe</p>
            </div>
            <div className="activity-item">
              <span className="activity-time">5h ago</span>
              <p>Equipment maintenance completed</p>
            </div>
            <div className="activity-item">
              <span className="activity-time">1d ago</span>
              <p>New class schedule updated</p>
            </div>
          </div>
        </div>

        <div className="section-card member-stats">
          <h2>Membership Growth</h2>
          <div className="growth-indicator">
            <FaChartLine />
           
            <span className="growth-period">vs last month</span>
          </div>
          <div className="chart-placeholder">
            <div className="mock-chart"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GymOwnerDashboardOverView;