import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import axios from "axios";
import theme from "./Theme/theme";
import API_BASE_URL from "./config";

import App from "./App";
import "./index.css";

import { AuthProvider } from "./Context/AuthContext";

// Global axios interceptor to redirect local backend calls to configured API URL
axios.interceptors.request.use(
  (config) => {
    if (config.url && config.url.startsWith("http://localhost:5000")) {
      config.url = config.url.replace("http://localhost:5000", API_BASE_URL);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

createRoot(document.getElementById("root")).render(

  <StrictMode>

    <BrowserRouter>

      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>

          <App />

        </AuthProvider>
      </ThemeProvider>

    </BrowserRouter>

  </StrictMode>

);