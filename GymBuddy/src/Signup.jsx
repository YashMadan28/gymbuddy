import React, { useRef, useState } from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "./firebase";
import { createUserProfile } from "./services/profile-api";
import "./landingpage.css";

const Signup = () => {
  const formRef = useRef(null);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    const formElement = formRef.current;
    if (!formElement) return;
  
    const formData = new FormData(formElement);
    const { name, email, password } = Object.fromEntries(formData.entries());
  
    try {
      // Validate inputs
      if (!name || !email || !password) {
        throw new Error("All fields are required");
      }
      if (password.length < 6) {
        throw new Error("Password should be at least 6 characters");
      }

      // Create Firebase auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update Firebase auth profile with name
      await updateProfile(userCredential.user, {
        displayName: name
      });

      // Create user profile in MongoDB (only pass name - service will handle UID/email)
      const profileResponse = await createUserProfile(name);

      if (!profileResponse.success) {
        // If MongoDB profile creation fails, delete the Firebase user
        await userCredential.user.delete();
        throw new Error(profileResponse.message || "Failed to create user profile");
      }
      
      toast.success("Account created successfully!", {
        position: "top-right",
        autoClose: 1000,
        onClose: () => navigate("/login")
      });
  
      formElement.reset();
    } catch (err) {
      console.error("Registration error:", err);
      let errorMessage = err.message;
      
      // Handle specific Firebase errors
      if (err.code) {
        switch (err.code) {
          case "auth/email-already-in-use":
            errorMessage = "This email is already registered";
            break;
          case "auth/invalid-email":
            errorMessage = "Please enter a valid email address";
            break;
          case "auth/weak-password":
            errorMessage = "Password should be at least 6 characters";
            break;
          default:
            errorMessage = "Registration failed. Please try again.";
        }
      }
      
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="landing-page-container">
      <ToastContainer />
      <div id="app" className="h-100">
        <div className="landing-wrapper animation left">
          <div className="landing-wrapper-inner">
            <header className="header-container">
              <h2 className="title animation a1">Join GymBuddy</h2>
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
                    minLength="2"
                    maxLength="50"
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />
                </div>
                <div className="form-group icon-input animation a5">
                  <FaLock className="input-icon" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Create Password (min 6 characters)"
                    className="form-control"
                    required
                    minLength="6"
                    disabled={isSubmitting}
                  />
                </div>
                <input 
                  type="submit" 
                  value={isSubmitting ? "Creating Account..." : "Sign Up"}
                  className="btn-submit animation a6" 
                  disabled={isSubmitting}
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