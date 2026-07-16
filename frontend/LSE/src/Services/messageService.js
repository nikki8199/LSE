import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/messages",
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
