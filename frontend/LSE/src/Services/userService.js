import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/users",
});

// Attach JWT token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ===============================
// Explore Users
// ===============================
export const exploreUsers = async () => {
  const response = await API.get("/explore");
  return response.data;
};

// ===============================
// Get Single User Profile
// ===============================
export const getUserProfile = async (id) => {
  const response = await API.get(`/profile/${id}`);
  return response.data;
};

// ===============================
// Search Users
// ===============================
export const searchUsers = async (keyword) => {
  const response = await API.get(`/search?keyword=${encodeURIComponent(keyword)}`);
  return response.data;
};

// ===============================
// Update Profile
// ===============================
export const updateProfile = async (body) => {
  const response = await API.patch("/update", body);
  return response.data;
};

// ===============================
// Get User Stats
// ===============================
export const getUserStats = async (id) => {
  const response = await API.get(`/profile/${id}/stats`);
  return response.data;
};

// ===============================
// Get Current User Stats (Dashboard)
// ===============================
export const getMyStats = async (id) => {
  const response = await API.get(`/profile/${id}/stats`);
  return response.data;
};

// ===============================
// Upload Profile Image
// ===============================
export const uploadProfileImage = async (formData) => {
  const response = await API.patch("/upload-profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};