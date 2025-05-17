import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <h1>Welcome to Campus E-Voting Platform</h1>
      <p>You are successfully logged in.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
