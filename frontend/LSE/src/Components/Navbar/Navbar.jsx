import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from "@mui/material";

import HandshakeIcon from "@mui/icons-material/Handshake";
import { useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: "rgba(11, 15, 25, 0.75)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          sx={{
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            <HandshakeIcon
              color="primary"
              sx={{ fontSize: 34 }}
            />

            <Typography
              variant="h5"
              fontWeight="bold"
              color="primary"
            >
              SkillSwap
            </Typography>
          </Box>

          {/* Buttons */}

          <Box
            sx={{
              display: "flex",
              gap: 2,
            }}
          >
            <Button
              variant="text"
              color="primary"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;