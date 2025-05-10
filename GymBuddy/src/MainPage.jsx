import React from "react";
import "./mainpage.css";
import { useNavigate } from "react-router-dom";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { motion } from "framer-motion";

const MainPage = () => {
  const navigate = useNavigate();

  return (
    // Container for the entire main page
    <div className="main-page-container">
      
      {/* Inner content area */}
      <div className="main-content">

        {/* Animated heading text */}
        <motion.div
          className="animated-text"
          // start slightly lower and invisible
          initial={{ opacity: 0, y: 20 }}
          // animate to fully visible and in place
          animate={{ opacity: 1, y: 0 }}
          // animation duration: 1 second
          transition={{ duration: 1 }}
        >
          Find A Workout Partner
        </motion.div>
        
        {/* Animated icon section that navigates to 'FindGymBuddy' page when clicked */}
        <motion.div
          className="icon-container"
          onClick={() => navigate("/FindGymBuddy")}
          // start fully transparent
          initial={{ opacity: 0 }}
          // fade in to full opacity
          animate={{ opacity: 1 }}
          // start after 0.5s, last 1s
          transition={{ delay: 0.5, duration: 1 }}
        >
          {/* Pulsing circle background around the dumbbell icon */}
          <div className="pulse-circle">
            <FitnessCenterIcon className="dumbbell-icon" /> 
          </div>

          {/* Text label below the icon */}
          <div className="icon-text-container">
            <p className="icon-text">Find Now</p>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default MainPage;