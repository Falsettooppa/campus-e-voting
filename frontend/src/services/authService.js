import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

export const getToken = () => localStorage.getItem('token');

export const isAuthenticated = () => !!getToken();

export const register = async (data) => {
  return axios.post(`${API_BASE_URL}/auth/register`, data);
};

export const login = async (data) => {
  const res = await axios.post(`${API_BASE_URL}/auth/login`, data);
  localStorage.setItem('token', res.data.token);
};

export const logout = () => {
  localStorage.removeItem('token');
};

// For protected requests
export const authAxios = axios.create({
  baseURL: API_BASE_URL
});

authAxios.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Get user profile
export const getUserProfile = async () => {
  return authAxios.get('/auth/me');
};
