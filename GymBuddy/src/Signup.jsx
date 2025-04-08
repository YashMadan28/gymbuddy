import React, { useRef } from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import "./landingpage.css";

const Signup = () => {
  const formRef = useRef(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
  
    const formElement = formRef.current;
    if (!formElement) return;
  
    const formData = new FormData(formElement);
    const { email, password } = Object.fromEntries(formData.entries());
  
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      
      toast.success("Account created successfully!", {
        position: "top-right",
        autoClose: 1000,
        onClose: () => navigate("/login")
      });
  
      formElement.reset();
    } catch (err) {
      toast.error(err.message, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="landing-page-container">
      <ToastContainer />
      <div id="app" className="h-100">
        <div className="landing-wrapper animation left">
          <div className="landing-wrapper-inner">
            <header className="header-container">
              <h2 className="title animation a1">
                Join GymBuddy
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
              <form ref={formRef} onSubmit={handleRegister}>
                <div className="form-group icon-input animation a3">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter Your Name"
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group icon-input animation a4">
                  <FaEnvelope className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group icon-input animation a5">
                  <FaLock className="input-icon" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Create Password"
                    className="form-control"
                    required
                  />
                </div>
                <input 
                  type="submit" 
                  value="Sign Up" 
                  className="btn-submit animation a6" 
                />
                <div className="auth-options">
                  <p className="auth-text animation a7">
                    Already have an account? <a href="/login" className="auth-link">Log In</a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="landing-wallpaper-box right">
          <div className="landing-wallpaper">
            <img src="/landing_page_image.jpg" alt="Signup background" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;