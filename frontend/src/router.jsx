import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';

import Dashboard from './pages/Dashboard/Dashboard';
import ElectionDetails from './pages/ElectionDetails';
import CreateElection from './pages/CreateElection';
import ElectionResults from './pages/ElectionResults';
import AdminUsers from './pages/Dashboard/AdminUsers';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import Navbar from './components/Navbar';
import { isAuthenticated } from './services/authService';

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

const AppRouter = () => (
  <Router>
    <Navbar />
    <Routes>
      {/* Default route */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Navigate to="/dashboard" replace />
          </ProtectedRoute>
        }
      />

      {/* Dashboard (Admin/Voter splitter) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Election details */}
      <Route
        path="/elections/:id"
        element={
          <ProtectedRoute>
            <ElectionDetails />
          </ProtectedRoute>
        }
      />

      {/* Election results */}
      <Route
        path="/elections/:id/results"
        element={
          <ProtectedRoute>
            <ElectionResults />
          </ProtectedRoute>
        }
      />

      {/* Admin create election */}
      <Route
        path="/admin/create-election"
        element={
          <ProtectedRoute>
            <CreateElection />
          </ProtectedRoute>
        }
      />
      {/* Admin user management */}
      <Route
  path="/admin/users"
  element={
    <ProtectedRoute>
      <AdminUsers />
    </ProtectedRoute>
  }
/>

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  </Router>
);

export default AppRouter;
