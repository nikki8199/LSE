import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./Theme/theme";

import App from "./App";
import "./index.css";

import { AuthProvider } from "./context/AuthContext";

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