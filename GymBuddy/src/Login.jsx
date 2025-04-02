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
  );
};

export default Login;

