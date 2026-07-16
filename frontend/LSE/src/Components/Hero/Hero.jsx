import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
} from "@mui/material";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function Hero() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "transparent",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="lg">

        <Stack
          spacing={4}
          alignItems="center"
          textAlign="center"
        >
          <Typography
            variant="h2"
            fontWeight="bold"
            sx={{
              fontSize: { xs: "2.8rem", sm: "3.8rem", md: "4.5rem" },
              lineHeight: 1.2
            }}
          >
            Learn. Teach. Connect.
          </Typography>

          <Typography
            variant="h6"
            color="text.secondary"
            maxWidth="650px"
          >
            Exchange skills with talented people in
            your local community. Discover new
            knowledge while helping others grow.
          </Typography>

          <Stack
            direction="row"
            spacing={2}
          >
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 3,
              }}
            >
              Get Started
            </Button>

            <Button
              variant="outlined"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 3,
              }}
            >
              Explore Skills
            </Button>
          </Stack>
        </Stack>

      </Container>
    </Box>
  );
}

export default Hero;