import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../apis/apis';
import { setLoading, loginSuccess, setError } from '../../redux/slices/authSlice';
import './Login.css';

 function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [localError, setLocalError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const response = await login({
        emailOrPhone: formData?.email,
        password: formData?.password
      });
      
      // Store token and user role in localStorage
      localStorage.setItem('authToken', response?.token);
      localStorage.setItem('userRole', response?.user?.role);
      dispatch(loginSuccess(response));
      // Navigate based on user role
      switch(response.user.role) {
        case 'admin':
          navigate('/admin-dashboard');
          break;
        case 'owner':
          navigate('/owner-dashboard');
          break;
        default:
          navigate('/user-dashboard');
      }
    } catch (err) {
      setLocalError(err.message || 'Login failed');
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
          Welcome to GymFit
        </h2>
        {localError && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{localError}</div>}
        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" style={{ color: 'black' }}>Email Address</label>
            <input
            style={{ color: 'black' }}
              id="email"
              type="text"
              name="email"
              placeholder="Enter your email or Phone Number"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" style={{ color: 'black' }}>Password</label>
            <input
            style={{ color: 'black' }}
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="auth-links">
            <a href="/forgot-password">Forgot Password?</a>
          </div>
          <button type="submit" className="submit-btn">Login</button>
          <div className="signup-prompt">
            Don't have an account?
            <a href="/signup">Sign up</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;