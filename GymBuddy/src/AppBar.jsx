/*import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import './Animations.css';

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
      sx={{
        width: "100%",
        backgroundColor: "black",
        height: "90px",
        boxShadow: "none",
        }}
    > 
      <Toolbar sx = {{ display: 'flex', justifyContent: 'center', paddingTop: '13px', alignItems: 'center'}}>
        <Link 
        to="/profile"
        style={{ textDecoration: 'none', marginRight: 'auto' }}
        state={{ isOwnProfile: true }}
        >
          <Button
            sx = {{
              padding: '10px 20px',
              border: 'none',
              fontSize: '17px',
              color: '#fff',
              borderRadius: '7px',
              letterSpacing: '4px',
              fontWeight: 700,
              textTransform: 'uppercase',
              transition: 'box-shadow 0.5s, background-color 0.5s',
              backgroundColor: 'rgb(0, 0, 0)',
              boxShadow: '0 0 25px rgb(0, 0, 0)',
              textDecoration: 'none',
              '&:hover': {
                boxShadow: '0 0 5px rgb(0, 140, 255), 0 0 0px rgb(0, 140, 255), 0 0 50px rgb(0,140,255), 0 0 100px rgb(0,140,255)',
                background: 'rgb(0, 140, 255)',
              },
            }}
          >
            Profile
          </Button>
        </Link>
        <div className = "titleDesign2" >
          <Typography 
            variant = "h6" 
            component = "div" 
            sx = {{ 
              fontSize: '30px',
              fontFamily: 'Courier',
              flexGrow: 1,
              textAlign: 'center',
              position: 'relative',
              display: 'inline-block',
              cursor: 'default', 
              justifyContent: 'center',
            }}
          >
            GymBuddy
            <span className = "hover-text" data-text = "GYMBUDDY"></span>
          </Typography>
        </div>     
          <Button 
            color = "inherit"
            sx = {{
              marginLeft: 'auto',
              justifyContent: 'right',
              padding: '10px 20px',
              border: 'none',
              fontSize: '17px',
              color: '#fff',
              borderRadius: '7px',
              letterSpacing: '4px',
              fontWeight: 700,
              textTransform: 'uppercase',
              transition: 'box-shadow 0.5s, background-color 0.5s',
              backgroundColor: 'rgb(0, 0, 0)',
              boxShadow: '0 0 25px rgb(0, 0, 0)',
              '&:hover': {
                boxShadow: '0 0 5px rgb(0, 140, 255), 00 00px rgb(0, 255, 26), 0 0 50px rgb(0,140,255), 0 0 100px rgb(0,140,255)',
                background: 'rgb(0, 140, 255)',
              },
            }}
          >
            Log in
          </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;*/
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const Header = () => {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        width: '100%', 
        backgroundColor: 'black', 
        height: '90px',
        boxShadow: "none",
      }}
    > 
      <Toolbar sx={{ display: 'flex', justifyContent: 'center', paddingTop: '13px' }}>
        <Link 
          to="/profile"
          style={{ textDecoration: 'none' }}
        >
          <Button
            sx={{
              padding: '10px 20px',
              border: 'none',
              fontSize: '17px',
              color: '#fff',
              borderRadius: '7px',
              letterSpacing: '4px',
              fontWeight: 700,
              textTransform: 'uppercase',
              transition: 'box-shadow 0.5s, background-color 0.5s',
              backgroundColor: 'rgb(0, 0, 0)',
              boxShadow: '0 0 25px rgb(0, 0, 0)',
              textDecoration: 'none',
              '&:hover': {
                boxShadow: '0 0 5px rgb(0, 140, 255), 0 0 50px rgb(0,140,255), 0 0 100px rgb(0,140,255)',
                background: 'rgb(0, 140, 255)',
              },
            }}
          >
            Profile
          </Button>
        </Link>

        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            textAlign: 'center',
            marginLeft: 'auto',
            marginRight: 'auto',
            display: 'flex', 
            justifyContent: 'center'
          }}
        >
          GymBuddy
        </Typography>

        {/* LOGIN BUTTON WITH NAVIGATION */}
        <Button 
          onClick={() => navigate('/Login')} // Navigate to login page
          sx={{
            marginRight: 'auto',
            justifyContent: 'right',
            padding: '10px 20px',
            border: 'none',
            fontSize: '17px',
            color: '#fff',
            borderRadius: '7px',
            letterSpacing: '4px',
            fontWeight: 700,
            textTransform: 'uppercase',
            transition: 'box-shadow 0.5s, background-color 0.5s',
            backgroundColor: 'rgb(0, 0, 0)',
            boxShadow: '0 0 25px rgb(0, 0, 0)',
            '&:hover': {
              boxShadow: '0 0 5px rgb(0, 140, 255), 0 0 50px rgb(0,140,255), 0 0 100px rgb(0,140,255)',
              background: 'rgb(0, 140, 255)',
            },
          }}
        >
          Log in
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
