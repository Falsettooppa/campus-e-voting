import axios from 'axios';

const API_URL = '/api/elections';
const token = localStorage.getItem('token');

const config = {
  headers: { Authorization: `Bearer ${token}` }
};

export const getAllElections = async () => {
  const res = await axios.get(API_URL, config);
  return res.data;
};

export const getElectionById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`, config);
  return res.data;
};

export const createElection = async (electionData) => {
  const res = await axios.post(API_URL, electionData, config);
  return res.data;
};

export const updateElection = async (id, electionData) => {
  const res = await axios.put(`${API_URL}/${id}`, electionData, config);
  return res.data;
};

export const deleteElection = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`, config);
  return res.data;
};
