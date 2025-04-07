<<<<<<< HEAD
import React from "react";
import { FaUser, FaLock } from "react-icons/fa";
import "./landingpage.css";
=======
import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";
>>>>>>> Messages-backend

const Login = () => {
  const formRef = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Ensure the form reference exists
    const formElement = formRef.current;
    if (!formElement) return;

    // Get form data
    const formData = new FormData(formElement);
    const { email, password } = Object.fromEntries(formData.entries());

    try {
      // Sign user in with Firebase Authentication
      const res = await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in:", res.user);

      // Show success toast
      toast.success("Logged in successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      // Optionally, clear the form
      formElement.reset();
    } catch (err) {
      console.error(err);
      toast.error(err.message, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  return (
<<<<<<< HEAD
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
=======
    <Container maxWidth="xs">
      <ToastContainer />
      <Paper
        elevation={3}
        sx={{ padding: 3, marginTop: 10, textAlign: "center" }}
      >
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>

        <Box
          component="form"
          ref={formRef}
          onSubmit={handleLogin}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField label="Email" variant="outlined" name="email" fullWidth required />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            name="password"
            fullWidth
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </Box>

        <Typography variant="body2" sx={{ marginTop: 2 }}>
          Don't have an account? <Link to="/Signup">Signup</Link>
        </Typography>
      </Paper>
    </Container>
>>>>>>> Messages-backend
  );
};

export default Login;

