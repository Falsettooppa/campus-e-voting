import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';  // Backend base URL

// Register user
export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

// Login user
export const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);

  // Save token to localStorage
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }

  return response.data;
};

// Get token
export const getToken = () => {
  return localStorage.getItem('token');
};

// Logout
export const logout = () => {
  localStorage.removeItem('token');
};
export const isAuthenticated = () => {
  return !!localStorage.getItem('token'); // Adjust based on how you store auth token
};



// Authenticated request helper
export const authAxios = () => {
  const token = getToken();
  return axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};
