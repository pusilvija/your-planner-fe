import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import TaskBoard from './pages/TaskBoard.jsx';
import TaskDetails from './pages/TaskDetails.jsx';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import ProtectedRoute from './components/routing/ProtectedRoute.js';
import MainLayout from './components/MainLayout.jsx';
import TasksPage from './pages/TasksPage.jsx';
import LandingPage from './pages/LandingPage.js';

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