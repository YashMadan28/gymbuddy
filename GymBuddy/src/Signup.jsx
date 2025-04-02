import { useRef, React } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db} from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";

const Signup = () => {
  const formRef = useRef(null);

  const handleRegister = async (e) => {
    e.preventDefault();

    const formElement = formRef.current;
    if (!formElement) return;

    const formData = new FormData(formElement);
    const { username, email, password } = Object.fromEntries(formData.entries());

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User created:", res.user);
      toast.success("Account created successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      await setDoc(doc(db, "users", res.user.uid),{
        username: username,
        email,
        id: res.user.uid
      });
      await setDoc(doc(db, "userchats", res.user.uid),{
        chats: [],
      });

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
          Signup
        </Typography>

        <Box
          component="form"
          ref={formRef}
          onSubmit={handleRegister}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField label="Username" variant="outlined" name="username" fullWidth required />
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
            Create an account
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Signup;


