import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AppBar from './AppBar';
import AppLayout from './AppLayout';
import Profile from './Profile';
import MainPage from './MainPage';
import { Link } from "react-router-dom";


function App() {

  return (
    <Router>
      <AppBar /> {AppBar}
      <Routes>
        <Route element = {<AppLayout />}>
          <Route path = "/" element = { <MainPage />} />
          <Route path = "/profile" element = {<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App
