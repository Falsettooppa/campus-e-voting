import axios from 'axios';

export const getToken = () => localStorage.getItem('token');

export const isAuthenticated = () => !!getToken();

export const register = async (data) => {
  return axios.post('http://localhost:3000/api/auth/register', data);
};

export const login = async (data) => {
  const res = await axios.post('http://localhost:3000/api/auth/login', data);
  localStorage.setItem('token', res.data.token);
};

export const logout = () => {
  localStorage.removeItem('token');
};

// For protected requests
export const authAxios = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});

// Get user profile
export const getUserProfile = async () => {
  return authAxios.get('/auth/me');
};
