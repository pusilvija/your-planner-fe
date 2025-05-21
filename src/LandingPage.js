import React from 'react';
import { Link } from 'react-router-dom';

import './LandingPage.css';


const LandingPage = () => {
  return (
    <div className="landing-container">
      <h1 className="landing-title">Welcome to Your Planner</h1>
      <p className="landing-subtitle">Please log in or register to continue.</p>
      <div className="landing-buttons">
        <Link to="/login" className="landing-button">Login</Link>
        <Link to="/register" className="landing-button">Register</Link>
      </div>
    </div>
  );
};

export default LandingPage;

