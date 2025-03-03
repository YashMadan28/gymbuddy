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
import Footer from './Footer';
import Typing from 'react-typing-animation';
import './index.css'; // Import the CSS file for styling

const MainPage = () => {
  return (
    <div className="main-container">
      <div className="text-container">
        <Typing speed={100}>
          <h1 className="typing-text">Ready to meet your workout partner?</h1>
        </Typing>
      </div>
      <div className="image-container">
        <img src="/src/assests/home page.jpg" alt="Workout partners" />
      </div>
    </div>
  );
};

export default MainPage;
