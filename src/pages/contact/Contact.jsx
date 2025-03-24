import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
    const form = useRef();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const sendEmail = (e) => {
        e.preventDefault();
        setIsSubmitted(true);

        emailjs.sendForm(
            'YOUR_SERVICE_ID',
            'YOUR_TEMPLATE_ID',
            form.current,
            'YOUR_PUBLIC_KEY'
        )
        .then((result) => {
            form.current.reset();
            setTimeout(() => setIsSubmitted(false), 3000);
        }, (error) => {
            console.log('Failed to send email:', error);
            setIsSubmitted(false);
        });
    };

    return (
        <div className="contact-container">
            <div className="contact-overlay"></div>
            <div className="contact-header">
                <h1>Get In Touch</h1>
                <p>We're here to help you achieve your fitness goals</p>
            </div>

            <div className="contact-content">
                <div className="contact-form-wrapper">
                    <div className="contact-form">
                        <h2>Send us a Message</h2>
                        {isSubmitted && (
                            <div className="success-message">
                                <FaCheckCircle />
                                <span>Message sent successfully!</span>
                            </div>
                        )}
                        <form ref={form} onSubmit={sendEmail}>
                            <div className="form-group">
                                <label className='lable-name'>Full Name</label>
                                <input type="text" name="user_name" placeholder="Enter your name" required />
                            </div>
                            <div className="form-group">
                                <label className='lable-name'>Email Address</label>
                                <input type="email" name="user_email" placeholder="Enter your email" required />
                            </div>
                            <div className="form-group">
                                <label className='lable-name'>Your Message</label>
                                <textarea name="message" placeholder="How can we help you?" required></textarea>
                            </div>
                            <button type="submit" className="submit-btn">
                                {isSubmitted ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="contact-info-wrapper">
                    <div className="social-links">
                        <h3>Connect With Us</h3>
                        <div className="social-icons">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="facebook">
                                <FaFacebook className="social-icon" />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="twitter">
                                <FaTwitter className="social-icon" />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="instagram">
                                <FaInstagram className="social-icon" />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="linkedin">
                                <FaLinkedin className="social-icon" />
                            </a>
                        </div>

                        <div className="contact-details">
                            <h3>Contact Information</h3>
                            <div className="contact-info">
                                <div className="contact-info-item">
                                    <FaPhone />
                                    <div>
                                        <h4>Phone</h4>
                                        <span>+1 234 567 8900</span>
                                    </div>
                                </div>
                                <div className="contact-info-item">
                                    <FaEnvelope />
                                    <div>
                                        <h4>Email</h4>
                                        <span>info@yourgym.com</span>
                                    </div>
                                </div>
                                <div className="contact-info-item">
                                    <FaMapMarkerAlt />
                                    <div>
                                        <h4>Location</h4>
                                        <span>123 Fitness Street, Gym City, GC 12345</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;