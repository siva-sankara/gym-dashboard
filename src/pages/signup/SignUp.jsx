import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './SignUp.css';
import { useDispatch } from 'react-redux';
import { sendOTP, signup } from '../../apis/apis';
import { setError, setLoading, signupSuccess } from '../../redux/slices/authSlice';

function SignUp() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    otp: '',
    password: '',
    phoneNumber: '',
    role: 'user'
  });
  const [otpSent, setOtpSent] = useState(false);
  const [error, setLocalError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //sending otp to email
  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      await sendOTP(formData.email);
      setOtpSent(true);
      setLocalError('');
    } catch (err) {
      setLocalError(err.message || 'Failed to send OTP');
    } finally {
      dispatch(setLoading(false));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const response = await signup({
        email: formData.email,
        firstName: formData.firstName,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
        otp: formData.otp
      });
      dispatch(signupSuccess(response));
      setLocalError('');
    } catch (err) {
      setLocalError(err.message || 'Signup failed');
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };


  return (
    <div className="signup-container">
      <motion.div 
        className="signup-box"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Sign Up</h2>
        {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label style={{ color: 'black', marginBottom: '5px', display: 'block' }}>Full Name</label>
            <input
              className='input-text'
              type="text"
              name="firstName"
              style={{ color: 'black' }}
              placeholder="Full Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label style={{ color: 'black', marginBottom: '5px', display: 'block' }}>Email Address</label>
            <input
              className='input-text'
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {!otpSent && (
              <button onClick={handleSendOTP} className="otp-button">
                Send OTP
              </button>
            )}
          </div>
          <div className="form-group">
            <label style={{ color: 'black', marginBottom: '5px', display: 'block' }}>Phone Number</label>
            <input
            tyle={{ color: 'black'}}
              className='input-text'
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          {otpSent && (
            <div className="form-group">
              <label style={{ color: 'black', marginBottom: '5px', display: 'block' }}>OTP</label>
              <input
                className='input-text'
                type="text"
                name="otp"
                style={{ color: 'black' }}
                placeholder="Enter 6-digit OTP"
                value={formData.otp}
                onChange={handleChange}
                maxLength="6"
                required
              />
            </div>
          )}
          <div className="form-group">
            <label style={{ color: 'black', marginBottom: '5px', display: 'block' }}>Password</label>
            <input
              className='input-text'
              type="password"
              name="password"
              placeholder="Password"
              style={{ color: 'black' }}
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            Sign Up
          </button>
        </form>
        <p className="login-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default SignUp;