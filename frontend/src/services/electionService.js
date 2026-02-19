import axios from 'axios';

const API_URL = 'http://localhost:5000/api/elections';

// Helper to always get fresh token
const getConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const getAllElections = async () => {
  const res = await axios.get(API_URL, getConfig());
  return res.data;
};

export const getElectionById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`, getConfig());
  return res.data;
};

export const createElection = async (electionData) => {
  const res = await axios.post(API_URL, electionData, getConfig());
  return res.data;
};

export const updateElection = async (id, electionData) => {
  const res = await axios.put(`${API_URL}/${id}`, electionData, getConfig());
  return res.data;
};

export const deleteElection = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`, getConfig());
  return res.data;
};
