import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://campus-e-voting-api.onrender.com/api';

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
// ==========================
// AUTH AXIOS (AUTO TOKEN)
// ==========================
authAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
export const forgotPassword = async (email) => {
  return axios.post(`${API_URL}/auth/forgot-password`, { email });
};

export const resetPassword = async (token, password) => {
  return axios.post(`${API_URL}/auth/reset-password/${token}`, { password });
};