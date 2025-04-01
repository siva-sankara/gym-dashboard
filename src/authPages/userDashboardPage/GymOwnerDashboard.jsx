import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FaHome, FaDumbbell, FaUsers, FaChartLine,
  FaCog, FaSearch, FaBuilding, FaCalendarCheck,
  FaMoneyBillWave, FaUserPlus, FaClipboardList,
  FaMapMarkerAlt, FaUserCog, FaBell,
  FaBars,
  FaTimes,
  FaListAlt
} from 'react-icons/fa';
import './GymOwnerDashboard.css';
import { fetchRegisteredGyms } from '../../apis/apis';
import { setGymList, setSelectedGym } from '../../redux/slices/gymSlice';


function GymOwnerDashboard({ children }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const { gymList, selectedGym } = useSelector((state) => state.gym);
  useEffect(() => {
    const loadGyms = async () => {
      try {
        const gyms = await fetchRegisteredGyms();
        const formattedGyms = gyms.map(gym => ({
          id: gym._id,
          name: gym.name,
          location: {
            address: gym.location.address,
            area: gym.location.area,
            city: gym.location.city,
            state: gym.location.state,
            pincode: gym.location.pincode,
            coordinates: gym.location.coordinates
          },
          contactInfo: {
            email: gym.contactInfo.email,
            phone: gym.contactInfo.phone,
            website: gym.contactInfo.website
          },
          operatingHours: gym.operatingHours,
          media: gym.media,
          owner: {
            id: gym.owner._id,
            name: gym.owner.firstName,
            email: gym.owner.email
          },
          status: gym.status,
          description: gym.description,
          facilities: gym.facilities,
          membershipPlans: gym.membershipPlans,
          members: gym.members,
          trainers: gym.trainers,
          businessDetails: gym.businessDetails,
          ratings: gym.ratings,
          registrationPayment: gym.registrationPayment,
          amenities: gym.amenities,
          notifications: gym.notifications,
          createdAt: gym.createdAt,
          updatedAt: gym.updatedAt,
          otherDetails: gym
        }));
        dispatch(setGymList(formattedGyms));
        if (formattedGyms.length > 0) {
          setSelectedGym(formattedGyms[0].id);
        }
      } catch (error) {
        console.error('Failed to load gyms:', error);
      }
    };
    loadGyms();
  }, [dispatch]);

  const handleGymChange = (e) => {
    const selectedGymId = e.target.value;
    const selectedGym = gymList.find(gym => gym.id === selectedGymId);
    dispatch(setSelectedGym(selectedGym));
  };

  const navItems = [
    { path: '/gym-owner-dashboard', label: 'Dashboard Overview', icon: <FaHome /> },
    { path: '/gym-owner-dashboard/mygyms', label: 'Gym Details', icon: <FaBuilding /> },
    { path: '/gym-owner-dashboard/members', label: 'Members', icon: <FaUsers /> },
    { path: '/gym-owner-dashboard/memberships', label: 'Memberships', icon: <FaDumbbell /> },
    { path: '/gym-owner-dashboard/revenue', label: 'Revenue & Analytics', icon: <FaMoneyBillWave /> },
    { path: '/gym-owner-dashboard/to-dos', label: 'Wrok Plan', icon: <FaListAlt /> },
    { path: '/gym-owner-dashboard/trainers', label: 'Trainers', icon: <FaUserPlus /> },
    { path: '/gym-owner-dashboard/schedules', label: 'Class Schedules', icon: <FaCalendarCheck /> },
    { path: '/gym-owner-dashboard/equipment', label: 'Equipment', icon: <FaClipboardList /> },
    { path: '/gym-owner-dashboard/locations', label: 'Locations', icon: <FaMapMarkerAlt /> },
    { path: '/gym-owner-dashboard/settings', label: 'Settings', icon: <FaCog /> }
  ];

  const isActive = (path) => {
    return location.pathname === path ||
      (path === '/gym-owner-dashboard/' && location.pathname === '/gym-owner-dashboard');
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // Implement search functionality
  };


  return (
    <div className="container-gym-owner">
      <div className={`sidebar-gym-owner ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className={`selector-gym-owner ${isSidebarOpen ? 'drop-open' : ''}`}>
          <select
            value={selectedGym?.id || ''}
            onChange={handleGymChange}
            className="select-gym-owner"
          >
            <option value="">Select Gym</option>
            {gymList.map(gym => (
              <option key={gym.id} value={gym.id}>
                {gym.name} - {gym.location.city}, {gym.location.state}
              </option>
            ))}
          </select>

        </div>


        <nav className="nav-gym-owner">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`link-gym-owner ${isActive(item.path) ? 'active-gym-owner' : ''}`}
            >
              <span className="icon-gym-owner">{item.icon}</span>
              <span className="label-gym-owner">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="profile-gym-owner">
          <FaUserCog className="profile-icon-gym-owner" />
          <span>Gym Owner Profile</span>
        </div>
      </div>

      <div className="main-gym-owner">
        <header className="header-gym-owner">
          <div className="search-container-gym-owner">

            <div className="desktop-search">
              <FaSearch className="search-icon-gym-owner" />
              <input
                type="text"
                placeholder="Search members, trainers, or equipment..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input-gym-owner"
              />
            </div>

            {/* Mobile Dropdown */}
            <div className="mobile-search">
              <button
                className="sidebar-toggle-btn"
                onClick={() => setSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? <FaTimes /> : <FaBars />}
              </button>
              <select
                value={selectedGym?.id || ''}
                onChange={handleGymChange}
                className="select-gym-owner"
              >
                <option value="">Select Gym</option>
                {gymList.map(gym => (
                  <option key={gym.id} value={gym.id}>
                    {gym.name} - {gym.location.city}, {gym.location.state}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </header>
        <div className="content-gym-owner">
          {children}
        </div>
      </div>
    </div>
  );
}

export default GymOwnerDashboard;