/*import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)*/
import React from 'react';
import './index.css';

const MainPage = () => {
  return (
    <div className="main-container">
      <div className="text-container">
        <h1 className="static-text">Ready to meet your workout partner?</h1>
      </div>
      <div className="image-container">
        <img src="/src/assests.home page.jpg" alt="Workout partners" />
      </div>
    </div>
  );
};

export default MainPage
