import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import './Header_Drawer.css';

const Header = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (isOpen) => (event) => {
    setOpen(isOpen);
  };

  const drawerContent = (
    <div
      role = "presentation"
      onClick = {toggleDrawer(false)}
      onKeyDown = {toggleDrawer(false)}
      style = {{ width: 250 }}
      >
        <List>
          <ListItem button>Profile</ListItem>
          <ListItem button>Page Item 2</ListItem>
          <ListItem button>Page Item 3</ListItem>
        </List>
      </div>
  );
  return (
    <header
      style={{
        backgroundColor: 'default',
        padding: '10px 100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: 'white'
      }}
      >
        <div style={{ alignItem: 'center', marginLeft: '100px'}}>
        <Button 
          onClick = { toggleDrawer(true) }
          sx = {{
            padding: '10px 20px',
            border: 'none',
            fontSize: '17px',
            color: '#fff',
            borderRadius: '7px',
            letterSpacing: '4px',
            fontWeight: 700, 
            textTransform: 'uppercase',
            transition: 'box-shadow 0.5',
            background: 'rgb(0,140,255)',
            boxShadow: '0 0 25px rgb(0,140,255)',
            '&:hover': {
              boxShadow: '0 0 5px rgb(0,140,255), 0 0 25px rgb(0,140,255), 0 0 50px rgb(0,140,255), 0 0 100px rgb(0,140,255)',
            },
          }}
          >
            Drawer
          </Button>
        </div>
        <div style = {{alignItems: 'center', padding: '100px'}}>
          <h1 style = {{ alignItem: 'center'}}>GymBuddy</h1>
        </div>
        <Drawer anchor = "left" open = {open} onClose={toggleDrawer(false)}>
          {drawerContent}
        </Drawer>
      </header>
  );
};

export default Header;
