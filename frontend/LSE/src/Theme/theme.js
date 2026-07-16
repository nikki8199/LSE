import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#06B6D4", // Neon Cyan
      light: "#67e8f9",
      dark: "#0891b2",
    },
    secondary: {
      main: "#D946EF", // Neon Pink/Magenta
      light: "#f0abfc",
      dark: "#c084fc",
    },
    background: {
      default: "#050811", // Deep Space Blue-Black
      paper: "rgba(10, 15, 30, 0.65)", // Translucent Dark Indigo
    },
    text: {
      primary: "#F8FAFC",
      secondary: "#94A3B8",
    },
    action: {
      selected: "rgba(6, 182, 212, 0.16)",
      hover: "rgba(255, 255, 255, 0.04)",
    },
    warning: {
      main: "#F59E0B",
    },
    error: {
      main: "#F43F5E",
    },
  },

  typography: {
    fontFamily: "'Outfit', 'Poppins', sans-serif",
    h1: { fontWeight: 900, letterSpacing: "-0.03em" },
    h2: { fontWeight: 800, letterSpacing: "-0.02em" },
    h3: { fontWeight: 800, letterSpacing: "-0.01em" },
    h4: { fontWeight: 700, letterSpacing: "-0.01em" },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 16,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "10px 22px",
          transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
          "&:hover": {
            transform: "translateY(-1.5px)",
            boxShadow: "0 8px 20px rgba(6, 182, 212, 0.25)",
          },
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #22d3ee 0%, #2563eb 100%)",
            boxShadow: "0 0 15px rgba(6, 182, 212, 0.5)",
          },
        },
        containedSecondary: {
          background: "linear-gradient(135deg, #D946EF 0%, #8B5CF6 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #f472b6 0%, #7c3aed 100%)",
            boxShadow: "0 0 15px rgba(217, 70, 239, 0.5)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "rgba(10, 15, 30, 0.55)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(6, 182, 212, 0.12)",
          boxShadow: "0 12px 36px rgba(0, 0, 0, 0.25)",
          transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 0 20px rgba(6, 182, 212, 0.2)",
            borderColor: "rgba(6, 182, 212, 0.45)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "rgba(10, 15, 30, 0.65)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "rgba(5, 8, 17, 0.75) !important",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(6, 182, 212, 0.25)",
          boxShadow: "none",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: "rgba(8, 12, 24, 0.9)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(6, 182, 212, 0.25)",
          boxShadow: "0 24px 48px rgba(0, 0, 0, 0.5)",
        },
      },
    },
  },
});

export default theme;