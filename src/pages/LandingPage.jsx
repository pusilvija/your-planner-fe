import React from 'react';

import './LandingPage.css';


const LandingPage = () => {
  return (
    <div className="landing-container">
        <img src="./images/your-planner.png" alt="Your Planner Logo" class="landing-logo" />
        <p class="landing-subtitle">Organize your tasks and boost your productivity</p>
        <div class="landing-buttons">
            <a href="/taskboard" class="landing-button">Go to Task Board</a>
            <a href="/about" class="landing-button">Learn More</a>
        </div>
    </div>
  );
};

export default LandingPage;

