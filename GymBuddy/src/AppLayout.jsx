import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import AppBar from './AppBar';


const AppLayout = () => {
  const location = useLocation();

  // Render the footer only on the main page ("/")
  const showFooter = location.pathname === '/';

  return (
    <div>
      <AppBar />  
      <Outlet />
      {showFooter && <Footer />}
    </div>
  );
};

export default AppLayout;