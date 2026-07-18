import axios from "axios";
import API_BASE_URL from "../config";

const API = axios.create({
  baseURL: `${API_BASE_URL}/messages`,
});

// Attach JWT token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getConversations = async () => {
  const response = await API.get("/conversations");
  return response.data;
};

export const getMessageThread = async (userId) => {
  const response = await API.get(`/thread/${userId}`);
  return response.data;
};

export const sendMessage = async (body) => {
  const response = await API.post("/send", body);
  return response.data;
};
