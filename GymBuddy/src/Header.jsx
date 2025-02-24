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
          <Button className = "shadow_btn" onClick = {toggleDrawer(true)}>
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
