import { authAxios } from './authService';
const API_URL = process.env.REACT_APP_API_URL || 'https://campus-e-voting-api.onrender.com/api/users';

export const getAllUsers = async (q = '') => {
  const res = await authAxios.get(`/users${q ? `?q=${encodeURIComponent(q)}` : ''}`);
  return res.data;
};

export const updateUserRole = async (id, role) => {
  const res = await authAxios.patch(`/users/${id}/role`, { role });
  return res.data;
};