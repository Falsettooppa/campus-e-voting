import axios from 'axios';

const API_URL = 'http://localhost:5000/api/elections';

// always get fresh token
const getConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

export const getAllElections = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const getElectionById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
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

// ✅ NEW: Vote
export const vote = async (electionId, candidateId) => {
  const res = await axios.post(
    `${API_URL}/${electionId}/vote`,
    { candidateId },
    getConfig()
  );
  return res.data;
};
export const updateElectionStatus = async (id, status) => {
  const res = await axios.patch(
    `${API_URL}/${id}/status`,
    { status },
    getConfig()
  );
  return res.data;
};
export const getMyVoteStatus = async (electionId) => {
  const res = await axios.get(`${API_URL}/${electionId}/my-vote`, getConfig());
  return res.data;
};

export const getVotersForElection = async (electionId) => {
  const res = await axios.get(`${API_URL}/${electionId}/voters`, getConfig());
  return res.data;
};

