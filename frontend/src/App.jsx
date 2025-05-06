import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import TaskBoard from './TaskBoard/TaskBoard.jsx';
import TaskDetails from './TaskDetails/TaskDetails.jsx';
import Login from './Login.js';
import Register from './Register.js';
import LandingPage from './LandingPage.js'; // Import the new LandingPage component

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Check if the token exists
  return token ? children : <Navigate to="/landing" replace />; // Redirect to the landing page
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page Route */}
        <Route path="/landing" element={<LandingPage />} />

        {/* Login and Register Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/"
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

        {/* Redirect to Landing Page by Default */}
        <Route path="*" element={<Navigate to="/landing" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;