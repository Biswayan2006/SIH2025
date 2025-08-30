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
footer {
  
  background: rgba(20, 20, 20, 0.85);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  border-top-left-radius: 100px;
  width: 100%;
  position: relative;
  color: white;
  font-family: 'Poppins', sans-serif;
  margin-top:50px;
}

.footer-container {
  display: flex;
  justify-content: space-between;
  padding: 50px 7%;
  flex-wrap: wrap;
  gap: 30px;
}

.footer-col {
  width: 25%;
  min-width: 220px;
}

.footer-col h2,
.footer-col h3 {
  text-transform: uppercase;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
}

p.email {
  margin: 30px 0;
}

p.phone {
  font-size: 16px;
  font-weight: 400;
}

.footer-col .text-office {
  margin-bottom: 20px;
}

.underline {
  width: 70px;
  height: 3px;
  position: relative;
  background-color: white;
  margin-top: 5px;
  margin-bottom: 20px;
  border-radius: 3px;
  overflow: hidden;
}

.underline span {
  width: 7px;
  height: 100%;
  position: absolute;
  left: 10px;
  background-color: rgb(63, 63, 63);
  border-radius: 3px;
  animation: moving 1.5s linear infinite;
}

@keyframes moving {
  0% { left: -20px; }
  100% { left: 100%; }
}

.footer-col ul {
  list-style-type: none;
  padding-top: 10px;
}

.footer-col ul li {
  margin: 10px 0;
}

.footer-col ul li a {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-col ul li a:hover {
  color: #ffcc00;
}

/* Newsletter Form */
.footer-col form {
  margin-top: 20px;
  border-bottom: 1px solid white;
  padding-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.footer-col form input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  padding: 8px;
  color: white;
}

.footer-col form button {
  background: #ffcc00;
  border: none;
  color: #000;
  padding: 8px 12px;
  border-radius: 50%;
  cursor: pointer;
  transition: 0.3s;
}

.footer-col form button:hover {
  background: #ffaa00;
  transform: scale(1.1);
}

.footer-col form i {
  font-size: 15px;
}

.footer-col .social-icons {
  margin-top: 20px;
}

.footer-col .social-icons a {
  display: inline-block;
  margin: 5px;
  cursor: pointer;
}

.footer-col .social-icons i {
  padding: 10px;
  background-color: white;
  color: #00093c;
  height:40px;
  width:40px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.footer-col .social-icons i:hover {
  transform: scale(1.15);
  color: white;
}

.footer-col .social-icons .fa-facebook-f:hover {
  background-color: #1877f2;
  box-shadow: 0 0 15px #1877f2;
}

.footer-col .social-icons .fa-instagram:hover {
  background-color: #e1306c;
  box-shadow: 0 0 15px #e1306c;
}

.footer-col .social-icons .fa-youtube:hover {
  background-color: #ff0000;
  box-shadow: 0 0 15px #ff0000;
}

.footer-col .social-icons .fa-linkedin-in:hover {
  background-color: #0a66c2;
  box-shadow: 0 0 15px #0a66c2;
}

.footer-para {
  max-width: 250px;
  line-height: 1.6;
}

.footer-bottom {
  text-align: center;
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  margin-top: 20px;
  font-size: 14px;
  color: #ccc;
}
  /* 🚫 Remove green outline/box on hover/focus */
a, button, input {
  outline: none;
  box-shadow: none;
}

a:focus, button:focus, input:focus {
  outline: none;
  box-shadow: none;
}


/* 📱 Responsive Design */
@media (max-width: 900px) {
  .footer-container {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .footer-col {
    width: 100%;
  }

  .footer-para {
    max-width: 100%;
  }

  .footer-col form {
    justify-content: center;
  }
}

.anim {
  margin-left: 200px;
  height: 500px;
}

.top {
  display: flex;
}

@media (max-width: 700px) {
  .anim {
    display: none;
  }
  .hero {
    flex-direction: column;
    text-align: center;
    margin-top: 0px;
  }
  #page1 {
    min-height: 20vh;
  }
}

      `}</style>
    </>
  );
}
