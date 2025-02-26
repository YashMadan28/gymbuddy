import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AppBar from './AppBar';
import Profile from './Profile';
import { Link } from "react-router-dom";


function App() {

  return (
    <Router>
      <AppBar/> {AppBar}
      <Routes>
        <Route path = "/" element = {
          <>
            <div>
              <a href="https://vite.dev" target="_blank">
                <img src={viteLogo} className="logo" alt="Vite logo" />
              </a>
              <a href="https://react.dev" target="_blank">
                <img src={reactLogo} className="logo react" alt="React logo" />
              </a>
            </div>
            <h1>
              Vite + React
            </h1>
          </>
        } />
        <Route path = "/profile" element = {<Profile />} />
      </Routes>

      <footer className = "footer">
        <button>Messages</button>
        <button>Stats</button>
        <button>Schedule</button>
        <button>Workout Library</button>
      </footer>
    </Router>
  );
}

export default App
