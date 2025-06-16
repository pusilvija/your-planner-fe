import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import {
  TaskBoard,
  TaskDetails,
  Login,
  Register,
  TasksPage,
  LandingPage,
} from './pages';
import { ProtectedRoute, MainLayout } from './components';

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
