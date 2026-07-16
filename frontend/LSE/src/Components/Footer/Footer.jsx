import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";

import HandshakeIcon from "@mui/icons-material/Handshake";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import GitHubIcon from "@mui/icons-material/GitHub";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

function Footer() {

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Box
      sx={{
        backgroundColor: "rgba(11, 15, 25, 0.95)",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        color: "white",
        pt: 8,
        pb: 3,
      }}
    >
      <Container maxWidth="lg">

        <Grid container spacing={5}>

          {/* Logo */}

          <Grid item xs={12} md={4}>

            <Stack direction="row" spacing={1} alignItems="center">

              <HandshakeIcon
                color="primary"
                sx={{
                  fontSize: 40,
                }}
              />

              <Typography
                variant="h4"
                fontWeight="bold"
              >
                SkillSwap
              </Typography>

            </Stack>

            <Typography
              sx={{
                mt: 3,
                color: "#CBD5E1",
                lineHeight: 1.8,
              }}
            >
              Learn, teach, and grow together.
              SkillSwap connects people in local communities
              to exchange knowledge instead of money.
            </Typography>

          </Grid>

          {/* Quick Links */}

          <Grid item xs={12} sm={6} md={2}>

            <Typography
              variant="h6"
              mb={2}
              fontWeight="bold"
            >
              Quick Links
            </Typography>

            <Stack spacing={1.5}>

              <Typography sx={{ cursor: "pointer" }}>
                Home
              </Typography>

              <Typography sx={{ cursor: "pointer" }}>
                Categories
              </Typography>

              <Typography sx={{ cursor: "pointer" }}>
                Community
              </Typography>

              <Typography sx={{ cursor: "pointer" }}>
                About
              </Typography>

            </Stack>

          </Grid>

          {/* Contact */}

          <Grid item xs={12} sm={6} md={3}>

            <Typography
              variant="h6"
              mb={2}
              fontWeight="bold"
            >
              Contact
            </Typography>

            <Typography color="#CBD5E1">
              Hyderabad, India
            </Typography>

            <Typography color="#CBD5E1">
              skillswap@gmail.com
            </Typography>

            <Typography color="#CBD5E1">
              +91 9876543210
            </Typography>

          </Grid>

          {/* Social */}

          <Grid item xs={12} md={3}>

            <Typography
              variant="h6"
              mb={2}
              fontWeight="bold"
            >
              Follow Us
            </Typography>

            <Stack direction="row">

              <IconButton sx={{ color: "white" }}>
                <FacebookIcon />
              </IconButton>

              <IconButton sx={{ color: "white" }}>
                <InstagramIcon />
              </IconButton>

              <IconButton sx={{ color: "white" }}>
                <LinkedInIcon />
              </IconButton>

              <IconButton sx={{ color: "white" }}>
                <GitHubIcon />
              </IconButton>

            </Stack>

          </Grid>

        </Grid>

        <Box
          sx={{
            borderTop: "1px solid rgba(255,255,255,.1)",
            mt: 6,
            pt: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >

          <Typography color="#CBD5E1">

            © {new Date().getFullYear()} SkillSwap.
            All Rights Reserved.

          </Typography>

          <IconButton
            onClick={scrollTop}
            sx={{
              bgcolor: "primary.main",
              color: "white",
              "&:hover": {
                bgcolor: "primary.dark",
              },
            }}
          >
            <KeyboardArrowUpIcon />
          </IconButton>

        </Box>

      </Container>
    </Box>
  );
}

export default Footer;