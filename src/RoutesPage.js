import React, { useEffect } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { LandingPage } from './pages/landingpage/Landingpage'

import SignUp from './pages/signup/SignUp'
import Contact from './pages/contact/Contact'
import ProtectedRoute from './ProtectedRoutes'
import MainLayout from './pages/mainlayout/MainLayout'
import Login from './pages/login/Login'
import UserDashboard from './authPages/userDashboardPage/UserDashBoard'
import GymOwnerDashboard from './authPages/userDashboardPage/GymOwnerDashboard'
import AdminDashboard from './authPages/userDashboardPage/AdminDashboard'
import About from './pages/aboutPage/About'
import AuthNavbar from './authPages/authNavbar/AuthNavbar'
import DashboardLayout from './authPages/dashboardLayout/DashboardLayout'
import { getLocationDetails, getUserById, updateUserAddress } from './apis/apis'
import { useDispatch } from 'react-redux'
import { setLocation } from './redux/slices/locationSlice'
import { getUserIdFromToken } from './utils/tokenDataRetrival'
import { setUser } from './redux/slices/userSlice'
import NearByGyms from './authPages/nearbyGyms/NearByGyms'
import ToDoCalendar from './authPages/todosList/ToDoCalendar'
import RegisterOwnGym from './authPages/registerOwnGym/RegisterOwnGym'
import GymDetails from './components/gymDetails/GymDetails'
import Payment from './authPages/paymentScreen/Payment'
import GymOwnerDashboardOverView from './authPages/gymOwnerDashboardPages/dashboardOverView/GymOwnerDashboardOverView'
import GymProfile from './authPages/gymOwnerDashboardPages/gymProfile/GymProfile'
import ManageGymMembers from './authPages/gymOwnerDashboardPages/gymMembers/ManageGymMembers'


function RoutesPage() {
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();
  const userId = getUserIdFromToken(token);

  const fetchUserDetails = async () => {
    if (token && userId) {
        try {
            const userData = await getUserById(userId);
            dispatch(setUser(userData));
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    }
};
  
  // Redirect to appropriate dashboard based on user role
  const getDashboardRoute = () => {
    const userRole = localStorage.getItem('userRole'); 
    if (!token) return '/login';

    switch (userRole) {
      case 'admin':
        return '/admin-dashboard';
      case 'gym_owner':
        return '/gym-owner-dashboard';
      default:
        return '/user-dashboard';
    }
  };


  // Get user's current location
  const getUserLocation = () => {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
              async (position) => {
                  try {
                      const { latitude, longitude } = position.coords;
                      const locationData = await getLocationDetails(latitude, longitude);
                      dispatch(setLocation(locationData));
                      // Update user's address in the backend
                      await updateUserAddress(locationData);
                  } catch (error) {
                      console.error('Error handling location:', error);
                  }
              },
              (error) => {
                  console.error('Error getting location:', error);
                  // Fallback to default location
                  getLocationDetails(18.783, 83.4301)
                      .then(async (locationData) => {
                          dispatch(setLocation(locationData));
                          // Update user's address with fallback location
                          await updateUserAddress(locationData);
                      })
                      .catch(err => console.error('Error getting default location:', err));
              }
          );
      }
  };
  useEffect(() => {
    getUserLocation();
  },[])

  useEffect(() => {
    fetchUserDetails();
  }, [token, userId]);
  
  const ProtectedLayout = ({ children }) => (
    <>
      <AuthNavbar />
      {children}
    </>
  );


  return (
    <div>
      <Routes>
        <Route path="/" element={
          <MainLayout>
            {token ? <Navigate to={getDashboardRoute()} /> : <LandingPage />}
          </MainLayout>
        } />
        <Route path="/about" element={
          <MainLayout>
            <About />
          </MainLayout>
        } />
        <Route path="/login" element={
          <MainLayout>
            {token ? <Navigate to={getDashboardRoute()} /> : <Login />}
          </MainLayout>
        } />
        <Route path="/signup" element={
          <MainLayout>
            {token ? <Navigate to={getDashboardRoute()} /> : <SignUp />}
          </MainLayout>
        } />
        <Route path="/contact" element={
          <MainLayout>
            <Contact />
          </MainLayout>
        } />

        {/* /* User Dashboard Routes */}
        <Route path="/user-dashboard/*" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <DashboardLayout>
                <Routes>
                  <Route index element={<UserDashboard />} />
                  <Route path="nearby-gyms" element={<NearByGyms />} />
                  <Route path="to-dos" element={<ToDoCalendar />} />
                  <Route path="register-gym" element={<RegisterOwnGym />} />
                  <Route path="gym/:gymId" element={<GymDetails />} />
                  <Route path="payment" element={<Payment />} />
                  <Route path="payment/:gymId" element={<Payment />} />
                </Routes>
              </DashboardLayout>
            </ProtectedLayout>
          </ProtectedRoute>
        } />

        {/* Gym Owner Dashboard Routes */}
          <Route path="/gym-owner-dashboard/*" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <GymOwnerDashboard>
                <Routes>
                  <Route index element={<GymOwnerDashboardOverView />} />
                  <Route path="mygyms/*" element={<GymProfile />} />
                  <Route path="to-dos" element={<ToDoCalendar />} />
                  <Route path="members" element={<ManageGymMembers  />} />
                  {/* 
                  <Route path="memberships" element={<Memberships />} />
                  <Route path="revenue" element={<Revenue />} />
                  <Route path="trainers" element={<Trainers />} />
                  <Route path="schedules" element={<Schedules />} />
                  <Route path="equipment" element={<Equipment />} />
                  <Route path="locations" element={<Locations />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="mygyms" element={<NearByGyms />} />
                  
                  <Route path="register-gym" element={<RegisterOwnGym />} /> */}
                  <Route path="gym/:gymId" element={<GymDetails />} />
                </Routes>
              </GymOwnerDashboard>
            </ProtectedLayout>
          </ProtectedRoute>
        } />
        {/* Admin Dashboard Routes */}
        <Route path="/admin-dashboard" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            </ProtectedLayout>
          </ProtectedRoute>
        } />

      </Routes>
    </div>
  )
}

export default RoutesPage