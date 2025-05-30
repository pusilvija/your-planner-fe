import React, { useState } from 'react';
import './Toolbar.css';
import WeatherApp from './WeatherApp/WeatherApp.js';
import Logout from './Auth/Logout.js';
import { useNavigate } from 'react-router-dom';


function Toolbar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleHome = () => {
    // navigate('/');
  }

  const handleTaskBoard = () => {
    navigate('/taskboard');
  };
  const handleTasks = () => {
    navigate('/tasks');
  };

  const { handleLogout } = Logout();

  return (
    <div className={`toolbar ${collapsed ? 'collapsed' : ''}`}>
      <button
        className="collapse-button"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? '>' : '<'}
      </button>
      {!collapsed && (
        <div className="weather-section">
          <WeatherApp />
        </div>
      )}
      {!collapsed && (
        <ul className="toolbar-menu">
          <li>
            <button onClick={handleHome}>Home</button>
          </li>
          <li>
            <button onClick={handleTaskBoard}>Task board</button>
          </li>
          <li>
            <button onClick={handleTasks}>Tasks</button>
          </li>
          <li>
          <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      )}
    </div>
  );
}

export default Toolbar;