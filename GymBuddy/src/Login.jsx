import React from "react";
import { FaUser, FaLock } from "react-icons/fa";
import "./landingpage.css";

const Login = () => {
  return (
    <div className="landing-page-container">
      <div id="app" className="h-100">
        <div className="landing-wrapper animation left">
          <div className="landing-wrapper-inner">
            <header className="header-container">
              <h2 className="title animation a1">
                Welcome to GymBuddy!
              </h2>
              <div className="dumbbell-container animation a2">
                <svg 
                  width="52"
                  height="48"
                  viewBox="0 0 32 24" 
                  fill="#000000"
                  className="dumbbell-icon"
                >
                  <rect x="1" y="5" width="6" height="14" rx="1.5" />
                  <rect x="7" y="8" width="5" height="8" rx="1" />
                  <rect x="12" y="10" width="8" height="4" rx="2" />
                  <rect x="20" y="8" width="5" height="8" rx="1" />
                  <rect x="25" y="5" width="6" height="14" rx="1.5" />
                </svg>
              </div>
            </header>
            <div className="main-form">
              <form action="nothing" method="POST">
                <div className="form-group icon-input animation a3">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Enter Username"
                    className="form-control"
                  />
                </div>
                <div className="form-group icon-input animation a4">
                  <FaLock className="input-icon" />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter Password"
                    className="form-control"
                  />
                </div>
                <input 
                  type="submit" 
                  name="login" 
                  value="Login" 
                  className="btn-submit animation a5" 
                />
                <div className="auth-options">
                  <p className="auth-text animation a6">
                    Don't have an account? <a href="/signup" className="auth-link">Sign up</a>
                  </p>
                  <p className="auth-text animation a7">
                    Or <a href="/" className="auth-link">continue as guest</a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="landing-wallpaper-box right">
          <div className="landing-wallpaper">
            <img src="/landing_page_image.jpg" alt="Login background" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

