import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import AppBar from "./AppBar";

const AppLayout = ({ user }) => {
  const location = useLocation();

  // Show footer only on the homepage (/home)
  const showFooter = location.pathname === "/home";

  return (
    <div>
      {/* Always show the top navigation bar */}
      <AppBar user={user} />
      {/* This renders the current route's component (e.g., MainPage, Login, etc.) */}
      <Outlet />
      {/* Conditionally show the footer only on the /home page */}
      {showFooter && <Footer />}
    </div>
  );
};

export default AppLayout;