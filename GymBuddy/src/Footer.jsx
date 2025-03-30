import React from 'react';
import { Link } from 'react-router-dom';
import './App.css'

const Footer = () => {
    return (
        <footer className = "footer"> 
            <Link to = "/messages">
                <button>Messages</button>
            </Link>
            <Link to = "/stats">
                <button>Stats</button>
            </Link>
            <Link to = "/schedule">
                <button>Schedule</button>
            </Link>
            <Link to = "/workout_library">
                <button>Workout Library</button>
            </Link>
        </footer>
    );
};

export default Footer;