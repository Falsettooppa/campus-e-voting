import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ElectionDetails from './pages/ElectionDetails';
import CreateElection from './pages/CreateElection';
import ElectionResults from './pages/ElectionResults';
import Dashboard from './pages/Dashboard';



import Navbar from './components/Navbar';
import { isAuthenticated } from './services/authService';

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

const AppRouter = () => (
  <Router>
    <Navbar />
    <Routes>
     <Route
  path="/"
  element={
    <ProtectedRoute>
      <Navigate to="/dashboard" replace />
    </ProtectedRoute>
  }
/>


      <Route
        path="/elections/:id"
        element={
          <ProtectedRoute>
            <ElectionDetails />
          </ProtectedRoute>
        }
      />
      <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>


      {/* ✅ Admin Create Election */}
      <Route
        path="/admin/create-election"
        element={
          <ProtectedRoute>
            <CreateElection />
          </ProtectedRoute>
        }
      />
      <Route
  path="/elections/:id/results"
  element={
    <ProtectedRoute>
      <ElectionResults />
    </ProtectedRoute>
  }
/>


      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  </Router>
);

export default AppRouter;
