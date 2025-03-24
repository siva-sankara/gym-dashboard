import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa'
import { MdEmail, MdLocationOn, MdPhone } from 'react-icons/md'
import './Footer.css'

function Footer() {
  const year = new Date().getFullYear()
  const nearbyGyms = [
    "FitZone - 0.5km",
    "PowerHouse - 1.2km",
    "Elite Fitness - 2.0km",
  ]

  return (
    <footer>
      <div className="footer__container">
        <article className="footer__about">
          <h4>About Us</h4>
          <p>
            We are dedicated to helping you achieve your fitness goals with state-of-the-art equipment and expert guidance.
          </p>
          <div className="footer__socials">
            <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebookF /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer"><FaLinkedinIn /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
          </div>
        </article>

        <article className="footer__contact">
          <h4>Contact Us</h4>
          <div className="footer__contact-details">
            <div>
              <MdLocationOn />
              <p>123 Fitness Street, Gym City, GC 12345</p>
            </div>
            <div>
              <MdPhone />
              <p>+1 234 567 8900</p>
            </div>
            <div>
              <MdEmail />
              <p>info@gymfitness.com</p>
            </div>
          </div>
        </article>

        <article className="footer__auth">
          <h4>Join Us</h4>
          <div className="footer__auth-buttons">
            <Link to="/login" className="footer__button login">Login</Link>
            <Link to="/signup" className="footer__button signup">Sign Up</Link>
          </div>
        </article>
      </div>

      <div className="footer__copyright">
        <small>Copyright &copy; {year} GYM Fitness. All Rights Reserved.</small>
      </div>
    </footer>
  )
}

export default Footer