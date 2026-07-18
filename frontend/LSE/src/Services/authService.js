// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5000/Authentication",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Register
// export const register = async (data) => {
//   const response = await API.post("/register", data);
//   return response.data;
// };

// // Login
// export const login = async (data) => {
//   const response = await API.post("/login", data);
//   return response.data;
// };

// export default API;

import axios from "axios";
import API_BASE_URL from "../config";

const API = axios.create({
    baseURL: `${API_BASE_URL}/Authentication`
});

export const sendOTP = async (data) => {
    const response = await API.post("/sendOTP", data);
    return response.data;
};

export const verifyOTP = async (data) => {
    const response = await API.post("/verifyOTP", data);
    return response.data;
};

export const login = async (data) => {
    const response = await API.post("/login", data);
    return response.data;
};