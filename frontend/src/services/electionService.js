import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// always get fresh token
const getConfig = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const getAllElections = async () => {
  const res = await axios.get(`${API_URL}/elections`);
  return res.data;
};

export const getElectionById = async (id) => {
  const res = await axios.get(`${API_URL}/elections/${id}`);
  return res.data;
};

export const createElection = async (electionData) => {
  const res = await axios.post(`${API_URL}/elections`, electionData, getConfig());
  return res.data;
};

export const updateElection = async (id, electionData) => {
  const res = await axios.put(`${API_URL}/elections/${id}`, electionData, getConfig());
  return res.data;
};

export const deleteElection = async (id) => {
  const res = await axios.delete(`${API_URL}/elections/${id}`, getConfig());
  return res.data;
};

export const vote = async (electionId, candidateId) => {
  const res = await axios.post(
    `${API_URL}/elections/${electionId}/vote`,
    { candidateId },
    getConfig()
  );
  return res.data;
};

export const updateElectionStatus = async (id, status) => {
  const res = await axios.patch(
    `${API_URL}/elections/${id}/status`,
    { status },
    getConfig()
  );
  return res.data;
};

export const getMyVoteStatus = async (electionId) => {
  const res = await axios.get(`${API_URL}/elections/${electionId}/my-vote`, getConfig());
  return res.data;
};

export const getVotersForElection = async (electionId) => {
  const res = await axios.get(`${API_URL}/elections/${electionId}/voters`, getConfig());
  return res.data;
};

export const getElectionResults = async (electionId) => {
  const res = await axios.get(`${API_URL}/elections/${electionId}/results`);
  return res.data;
};