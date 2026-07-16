import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#6366F1", // Indigo
      light: "#818CF8",
      dark: "#4F46E5",
    },
    secondary: {
      main: "#10B981", // Emerald
      light: "#34D399",
      dark: "#059669",
    },
    background: {
      default: "#0B0F19", // Space Slate
      paper: "#111827", // Charcoal Slate
    },
    text: {
      primary: "#F8FAFC",
      secondary: "#94A3B8",
    },
    action: {
      selected: "rgba(99, 102, 241, 0.16)",
      hover: "rgba(255, 255, 255, 0.04)",
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
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-1.5px)",
            boxShadow: "0 8px 20px rgba(99, 102, 241, 0.35)",
          },
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
        },
        containedSecondary: {
          background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "rgba(17, 24, 39, 0.6)",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(255, 255, 255, 0.07)",
          boxShadow: "0 12px 36px rgba(0, 0, 0, 0.25)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 24px 48px rgba(0, 0, 0, 0.35)",
            borderColor: "rgba(99, 102, 241, 0.25)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "rgba(11, 15, 25, 0.75) !important",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "none",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: "#111827",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 24px 48px rgba(0, 0, 0, 0.5)",
        },
      },
    },
  },
});

export default theme;