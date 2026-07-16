import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/exchange",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export async function sendExchangeRequest(body) {
  const response = await API.post("/send", body);
  return response.data;
}

export async function getSentRequests() {
  const response = await API.get("/sent");
  return response.data;
}

export async function getReceivedRequests() {
  const response = await API.get("/received");
  return response.data;
}

export async function acceptExchangeRequest(id) {
  const response = await API.patch(`/accept/${id}`);
  return response.data;
}

export async function rejectExchangeRequest(id) {
  const response = await API.patch(`/reject/${id}`);
  return response.data;
}

export async function completeExchangeRequest(id) {
  const response = await API.patch(`/complete/${id}`);
  return response.data;
}