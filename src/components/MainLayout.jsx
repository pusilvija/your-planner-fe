import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toolbar } from '../components';
import './MainLayout.css';

function MainLayout() {
  return (
    <div className="main-layout">
      <Toolbar />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
