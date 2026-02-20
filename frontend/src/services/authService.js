import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// ==========================
// REGISTER
// ==========================
export const register = async (userData) => {
  return axios.post(`${API_URL}/auth/register`, userData);
};

// ==========================
// LOGIN
// ==========================
export const login = async (credentials) => {
  const response = await axios.post(
    `${API_URL}/auth/login`,
    credentials
  );

  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }

  return response;
};

// ==========================
// GET USER PROFILE
// ==========================
export const getUserProfile = async () => {
  const token = localStorage.getItem('token');

  return axios.get(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

// ==========================
// CHECK AUTH
// ==========================
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// ==========================
// LOGOUT
// ==========================
export const logout = () => {
  localStorage.removeItem('token');
};
export const authAxios = axios.create({ baseURL: API_URL });
