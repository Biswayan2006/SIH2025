import React from "react";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function Layout({ children }) {
  return (
    <>
      {/* 🏗️ Page Content */}
      <main>{children}</main>
      

      {/* 🌟 Footer */}
      <footer>
        <div className="footer-container">
          {/* About */}
          <div className="footer-col">
            <p className="footer-para">
              Public transport systems are the backbone of urban mobility, 
            providing affordable, safe, and eco-friendly travel for millions of 
            people every day. By reducing traffic congestion, lowering pollution, 
            and connecting communities, they play a vital role in building 
            sustainable and inclusive cities.
            </p>
          </div>

          {/* Address */}
          <div className="footer-col">
            <h3 className="text-office">
              Address
              <div className="underline"><span></span></div>
            </h3>
            <p>Sector 5, Saltlake</p>
            <p>Kolkata, West Bengal, India</p>
            <p className="email">studentresoursewebsite@gmail.com</p>
            <p className="phone">+91 98765 43210</p>
          </div>

          {/* Menu */}
          <div className="footer-col">
            <h3>
              Menu
              <div className="underline"><span></span></div>
            </h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/src/live Tracking">Live tracking</Link></li>
              <li><Link to="/Routes">Routes</Link></li>
              <li><Link to="/Profile">Profile</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Newsletter + Social */}
          <div className="footer-col">
            <h3>
              Newsletter
              <div className="underline"><span></span></div>
            </h3>
            <form>
              <i className="fa-solid fa-envelope"></i>
              <input type="email" placeholder="Enter your email" required />
              <button type="submit">
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </form>

            <div className="social-icons">
              <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#"><i className="fa-brands fa-instagram"></i></a>
              <a href="#"><i className="fa-brands fa-youtube"></i></a>
              <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          © 2025 Student Resource Website | All Rights Reserved
        </div>
      </footer>

      {/* ✅ CSS directly inside React */}
      <style>{`
       

        
       /* 🌟 Footer Styles suri */

/* 🌟 Compressed Footer Styles */
footer {
  background: rgba(20, 20, 20, 0.9);
  backdrop-filter: blur(8px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-top-left-radius: 70px;
  width: 100%;
  color: white;
  font-family: 'Poppins', sans-serif;
  margin-top: 40px;
  font-size: 14px; /* smaller text */
}

.footer-container {
  display: flex;
  justify-content: space-between;
  padding: 25px 5%; /* reduced padding */
  flex-wrap: wrap;
  gap: 20px; /* reduced gap */
}

.footer-col {
  width: 22%;
  min-width: 180px;
}

.footer-col h2,
.footer-col h3 {
  text-transform: uppercase;
  margin-bottom: 12px;
  font-size: 15px; /* smaller heading */
  font-weight: 600;
}

.footer-para {
  max-width: 220px;
  line-height: 1.4;
  font-size: 13px;
}

p.email {
  margin: 15px 0;
}

p.phone {
  font-size: 14px;
}

.underline {
  width: 50px; /* smaller underline */
  height: 2px;
  margin-top: 3px;
  margin-bottom: 12px;
}

.footer-col ul {
  list-style-type: none;
  padding-top: 5px;
}

.footer-col ul li {
  margin: 6px 0; /* less space */
}

.footer-col ul li a {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
  font-size: 13px;
}

.footer-col ul li a:hover {
  color: #ffcc00;
}

/* Newsletter Form */
.footer-col form {
  margin-top: 12px;
  border-bottom: 1px solid white;
  padding-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer-col form input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  padding: 5px;
  font-size: 13px;
  color: white;
}

.footer-col form button {
  background: #ffcc00;
  border: none;
  color: #000;
  padding: 6px 8px;
  border-radius: 50%;
  cursor: pointer;
  transition: 0.3s;
}

.footer-col form button:hover {
  background: #ffaa00;
  transform: scale(1.05);
}

.footer-col .social-icons {
  margin-top: 12px;
  display: flex;
  gap: 10px; /* equal spacing */
}

.footer-col .social-icons a {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  width: 36px;
  border-radius: 50%;
  background-color: white;
  color: #00093c;
  font-size: 16px;
  transition: all 0.3s ease;
}

.footer-col .social-icons a:hover {
  transform: scale(1.1);
  color: white;
}

.footer-col .social-icons .fa-facebook-f:hover {
  background-color: #1877f2;
  box-shadow: 0 0 10px #1877f2;
}

.footer-col .social-icons .fa-instagram:hover {
  background-color: #e1306c;
  box-shadow: 0 0 10px #e1306c;
}

.footer-col .social-icons .fa-youtube:hover {
  background-color: #ff0000;
  box-shadow: 0 0 10px #ff0000;
}

.footer-col .social-icons .fa-linkedin-in:hover {
  background-color: #0a66c2;
  box-shadow: 0 0 10px #0a66c2;
}

.footer-bottom {
  text-align: center;
  padding: 12px; /* smaller bottom padding */
  font-size: 12px;
  color: #bbb;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}


      `}</style>
    </>
  );
}
