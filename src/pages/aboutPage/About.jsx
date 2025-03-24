import React from 'react';
import { Features } from '../../components/features/Features';
import './About.css';
import Footer from '../../components/footer/Footer';

function About() {
  return (
   <div>
     <div className="about-container">
      <section className="hero-sections">
        <div className="hero-content">
          <h1>About GymConnect</h1>
          <p className="hero-text">
            Your all-in-one platform for gym management and discovery. We connect gym owners 
            with potential members while providing powerful tools for efficient gym operations.
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Gyms Connected</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Active Members</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-label">Satisfaction Rate</span>
            </div>
          </div>
        </div>
      </section>
      <section className="target-users">
        <h2>Who We Serve</h2>
        <div className="users-grid">
          <div className="user-card">
            <h3>Gym Owners</h3>
            <ul>
              <li>Manage your gym efficiently</li>
              <li>Track member activities</li>
              <li>Handle billing and payments</li>
              <li>Increase visibility</li>
              <li>Access analytics and insights</li>
            </ul>
          </div>
          <div className="user-card">
            <h3>Gym Members</h3>
            <ul>
              <li>Find nearby gyms</li>
              <li>Easy registration process</li>
              <li>Track membership status</li>
              <li>View gym facilities</li>
              <li>Manage payments</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="our-mission">
        <h2>Our Mission</h2>
        <div className="mission-content">
          <div className="mission-text">
            <p>We're dedicated to revolutionizing the fitness industry by creating seamless connections between gyms and their members. Our platform empowers both gym owners and fitness enthusiasts to achieve their goals efficiently.</p>
          </div>
          <div className="mission-values">
            <div className="value-item">
              <h4>Innovation</h4>
              <p>Constantly evolving our platform with cutting-edge technology</p>
            </div>
            <div className="value-item">
              <h4>Community</h4>
              <p>Building stronger connections in the fitness community</p>
            </div>
            <div className="value-item">
              <h4>Excellence</h4>
              <p>Maintaining high standards in service and support</p>
            </div>
          </div>
        </div>
      </section>

      <Features />

      <section className="testimonials ">
        <h2>What Our Users Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p>"GymConnect has transformed how I manage my gym. The platform is intuitive and powerful."</p>
            <cite>- John Smith, Gym Owner</cite>
          </div>
          <div className="testimonial-card">
            <p>"Finding and managing my gym membership has never been easier!"</p>
            <cite>- Sarah Johnson, Gym Member</cite>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <h2>Get Started Today</h2>
        <p>Join our platform and transform the way you manage or find your perfect gym.</p>
        <button className="cta-button">Contact Us</button>
      </section>
     
    </div>
    <Footer />
   </div>
  );
}
export default About;