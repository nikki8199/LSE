import {
  Box,
  Typography,
  Button,
  Stack,
} from "@mui/material";

import WavingHandIcon from "@mui/icons-material/WavingHand";
import ExploreIcon from "@mui/icons-material/Explore";

import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function WelcomeCard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        background:
          "linear-gradient(135deg,#2563EB,#3B82F6,#60A5FA)",
        color: "white",
        borderRadius: 5,
        p: 5,
        mb: 4,
        overflow: "hidden",
      }}
    >
      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        justifyContent="space-between"
        alignItems="center"
        spacing={3}
      >
        <Box>
          <Typography
            variant="h3"
            fontWeight="bold"
          >
            Welcome Back,
          </Typography>

          <Typography
            variant="h4"
            sx={{
              mt: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {user?.name}
            <WavingHandIcon />
          </Typography>

          <Typography
            sx={{
              mt: 2,
              opacity: 0.9,
              maxWidth: 500,
            }}
          >
            Share your knowledge, learn something
            new and connect with talented people
            in your local community.
          </Typography>

          <Button
            variant="contained"
            color="secondary"
            startIcon={<ExploreIcon />}
            onClick={() => navigate("/explore")}
            sx={{
              mt: 4,
              px: 4,
              py: 1.3,
              borderRadius: 3,
              fontWeight: "bold",
            }}
          >
            Explore Skills
          </Button>
        </Box>

        <Box
          sx={{
            fontSize: 130,
          }}
        >
          🤝
        </Box>
      </Stack>
    </Box>
  );
}

export default WelcomeCard;