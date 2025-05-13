import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import TaskBoard from './TaskBoard/TaskBoard.jsx';
import TaskDetails from './TaskDetails/TaskDetails.jsx';
import Login from './Login.js';
import Register from './Register.js';
import LandingPage from './LandingPage.js';
import ProtectedRoute from './ProtectedRoute.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/taskboard"
          element={
            <ProtectedRoute>
              <TaskBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/:taskId"
          element={
            <ProtectedRoute>
              <TaskDetails />
            </ProtectedRoute>
          }
        />

        {/* Redirect all unknown routes to the main page (LandingPage) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;