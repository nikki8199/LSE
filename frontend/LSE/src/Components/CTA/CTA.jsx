import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
} from "@mui/material";

import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

function CTA() {
  return (
    <Box
      sx={{
        py: 12,
        background: "linear-gradient(135deg, #6366F1, #10B981)",
        color: "white",
      }}
    >
      <Container maxWidth="md">

        <Stack
          spacing={4}
          alignItems="center"
          textAlign="center"
        >

          <RocketLaunchIcon sx={{ fontSize: 70 }} />

          <Typography
            variant="h3"
            fontWeight="bold"
          >
            Ready to Share Your Skills?
          </Typography>

          <Typography
            sx={{
              opacity: .9,
              maxWidth: 650,
              fontSize: 20,
            }}
          >
            Join thousands of learners and mentors exchanging
            real-world skills. Learn something new while helping
            someone else grow.
          </Typography>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
          >

            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: "white",
                color: "#2563EB",
                px: 5,
                py: 1.5,
                borderRadius: 4,
                fontWeight: "bold",
                "&:hover": {
                  bgcolor: "#F1F5F9",
                },
              }}
            >
              Join Community
            </Button>

            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: "white",
                color: "white",
                px: 5,
                py: 1.5,
                borderRadius: 4,
                "&:hover": {
                  borderColor: "white",
                  bgcolor: "rgba(255,255,255,.1)",
                },
              }}
            >
              Login
            </Button>

          </Stack>

        </Stack>

      </Container>
    </Box>
  );
}

export default CTA;