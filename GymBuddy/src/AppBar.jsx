import React, { useState, useEffect } from "react";
import { auth } from './firebase';
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import "./animations.css";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  const SIZES = {
    HEADER_HEIGHT: "90px",
    HEADER_PADDING: "13px",
    TITLE_FONT: "30px",
    BUTTON_FONT: "17px",
    LETTER_SPACING: "4px"
  };

  const styles = {
    box: {
      display: "flex",
      flexGrow: 0
    },
    commonButton: {
      padding: "10px 20px",
      border: "none",
      marginLeft: "auto",
      justifyContent: "right",
      fontSize: SIZES.BUTTON_FONT,
      color: "#fff",
      borderRadius: "7px",
      letterSpacing: "4px",
      fontWeight: 700,
      textTransform: "uppercase",
      transition: "box-shadow 0.5s, background-color 0.5s",
      backgroundColor: "rgb(0, 0, 0)",
      boxShadow: "0 0 25px rgb(0, 0, 0)",
      "&:hover": {
        boxShadow:
          "0 0 5px rgb(0, 140, 255), 00 00px rgb(0, 255, 26), 0 0 50px rgb(0,140,255), 0 0 100px rgb(0,140,255)",
        background: "rgb(0, 140, 255)",
      },
    },
    appBar: {
      width: "100%",
      backgroundColor: "black",
      height: SIZES.HEADER_HEIGHT,
      boxShadow: "none",
    },
    toolbar: {
      display: "flex",
      justifyContent: "center",
      paddingTop: SIZES.HEADER_PADDING,
      alignItems: "center",
    }
  };
  
  return (
    <AppBar
      position="fixed"
      sx={styles.appBar}
    >
      <Toolbar
        sx={styles.toolbar}
      >
        <Box sx={styles.boxShadow}>
          <Link
            to="/profile"
            style={{ textDecoration: "none", marginRight: "auto" }}
            state={{ isOwnProfile: true }}
          >
            <Button
              sx={styles.commonButton}
            >
              Profile
            </Button>
          </Link>
        </Box>
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
          <div className="titleDesign2">
            <Typography
              variant="h6"
              component={Link}
              to="/home"
              sx={{
                fontSize: "30px",
                fontFamily: "Courier",
                flexGrow: 1,
                textAlign: "center",
                position: "relative",
                display: "inline-block",
                cursor: "pointer",
                justifyContent: "center",
              }}
            >
              GymBuddy
              <span className="hover-text" data-text="GYMBUDDY"></span>
            </Typography>
          </div>
        </Box>
        <Box sx={{ display: "flex", flexGrow: 0 }}>
          {user ? (
            <Button
            onClick={handleLogout}
            color = ""
            sx = {styles.commonButton}
            >
              Logout
            </Button>
          ) : (
          <Link to="/login" style={{ textDecoration: "none" }}>
            <Button
              color="inherit"
              sx={styles.commonButton}
            >
              Log in
            </Button>
          </Link>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
