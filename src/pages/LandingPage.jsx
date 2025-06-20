import React from 'react';

import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <img
        src="./images/your-planner.png"
        alt="Your Planner Logo"
        className="landing-logo"
      />
      <p className="landing-subtitle">
        Organize your tasks and boost your productivity
      </p>
      <div className="landing-buttons">
        <a href="/taskboard" className="landing-button">
          Go to Task Board
        </a>
        <a href="/about" className="landing-button">
          Learn More
        </a>
      </div>
    </div>
  );
};

export default LandingPage;
