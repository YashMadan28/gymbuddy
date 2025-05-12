import React, { useRef } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import "./landingpage.css";

const Login = () => {
  const formRef = useRef(null);
  const navigate = useNavigate();

  // Handle user login
  const handleLogin = async (e) => {
    e.preventDefault();

    const formElement = formRef.current;
    if (!formElement) return;

    // Extract email and password from form
    const formData = new FormData(formElement);
    const { email, password } = Object.fromEntries(formData.entries());

    try {
      // Attempt login via Firebase Authentication
      const res = await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in:", res.user);

      // Show success message, navigate home after a short delay
      toast.success("Logged in successfully!", {
        position: "top-right",
        autoClose: 1000,
        onClose: () => navigate("/")
      });

      // Reset the form
      formElement.reset();
    } catch (err) {
      // Handle login failure and display error message
      console.error(err);
      toast.error(err.message, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  return (
    // Main layout container
    <div className="landing-page-container">
      {/* Toast notification container */}
      <ToastContainer />

      <div id="app" className="h-100">
        <div className="landing-wrapper animation left">
          <div className="landing-wrapper-inner">
            {/* Header section */}
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

            {/* Login form */}
            <div className="main-form">
              <form ref={formRef} onSubmit={handleLogin}>
                {/* Email input */}
                <div className="form-group icon-input animation a3">
                  <FaUser className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    className="form-control"
                    required
                  />
                </div>

                {/* Password input */}
                <div className="form-group icon-input animation a4">
                  <FaLock className="input-icon" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    className="form-control"
                    required
                  />
                </div>

                {/* Submit button */}
                <input 
                  type="submit" 
                  name="login" 
                  value="Login" 
                  className="btn-submit animation a5" 
                />

                {/* Navigation links */}
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

        {/* Right-side background image */}
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


