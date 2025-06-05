import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import TaskBoard from './TaskBoard/TaskBoard.jsx';
import TaskDetails from './TaskDetails/TaskDetails.jsx';
import Login from './Auth/Login.js';
import Register from './Auth/Register.js';
import ProtectedRoute from './ProtectedRoute.js';
import MainLayout from './MainLayout.jsx';
import TasksPage from './TasksPage.jsx';
import LandingPage from './LandingPage.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes with Toolbar */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/taskboard" element={<TaskBoard />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/tasks/:taskId" element={<TaskDetails />} />
        </Route>

        {/* Redirect all unknown routes to the landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;