import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/videos",
});

// Attach JWT token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getVideos = async () => {
  const response = await API.get("/");
  return response.data;
};

export const uploadVideo = async (formData) => {
  const response = await API.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const toggleLikeVideo = async (id) => {
  const response = await API.post(`/like/${id}`);
  return response.data;
};

export const deleteVideo = async (id) => {
  const response = await API.delete(`/${id}`);
  return response.data;
};
