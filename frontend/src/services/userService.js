import { authAxios } from './authService';

export const getAllUsers = async (q = '') => {
  const res = await authAxios.get(`/users${q ? `?q=${encodeURIComponent(q)}` : ''}`);
  return res.data;
};

export const updateUserRole = async (id, role) => {
  const res = await authAxios.patch(`/users/${id}/role`, { role });
  return res.data;
};