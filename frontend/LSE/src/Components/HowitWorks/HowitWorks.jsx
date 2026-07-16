import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
} from "@mui/material";

import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import SearchIcon from "@mui/icons-material/Search";
import SchoolIcon from "@mui/icons-material/School";

const steps = [
  {
    icon: <PersonAddAlt1Icon sx={{ fontSize: 55 }} />,
    title: "Create Your Profile",
    description:
      "Register in minutes and showcase the skills you can teach along with the skills you want to learn.",
  },
  {
    icon: <SearchIcon sx={{ fontSize: 55 }} />,
    title: "Find Skill Partners",
    description:
      "Discover people in your community who match your interests and start meaningful skill exchanges.",
  },
  {
    icon: <SchoolIcon sx={{ fontSize: 55 }} />,
    title: "Learn & Grow Together",
    description:
      "Meet, collaborate, share knowledge, and help each other become better every day.",
  },
];

function HowItWorks() {
  return (
    <Box
      sx={{
        py: 10,
        backgroundColor: "transparent",
      }}
    >
      <Container maxWidth="lg">

        <Typography
          variant="h3"
          fontWeight="bold"
          align="center"
        >
          How SkillSwap Works
        </Typography>

        <Typography
          align="center"
          color="text.secondary"
          sx={{ mt: 2, mb: 8 }}
        >
          Getting started is simple. Join the community in just
          three easy steps.
        </Typography>

        <Grid container spacing={4} justifyContent="center">

          {steps.map((step, index) => (

            <Grid
              item
              xs={12}
              md={4}
              key={index}
            >

              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: "center",
                  borderRadius: 5,
                  background: "rgba(17, 24, 39, 0.6)",
                  backdropFilter: "blur(14px)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  height: "100%",
                  transition: ".3s",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0px 15px 40px rgba(99, 102, 241, 0.15)",
                    borderColor: "rgba(99, 102, 241, 0.3)",
                  },
                }}
              >

                <Box
                  sx={{
                    width: 90,
                    height: 90,
                    mx: "auto",
                    mb: 3,
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                    background:
                      "linear-gradient(135deg,#2563EB,#06B6D4)",
                  }}
                >
                  {step.icon}
                </Box>

                <Typography
                  variant="h5"
                  fontWeight="bold"
                  mb={2}
                >
                  {step.title}
                </Typography>

                <Typography color="text.secondary" align="center">
                  {step.description}
                </Typography>

              </Paper>

            </Grid>

          ))}

        </Grid>

      </Container>
    </Box>
  );
}

export default HowItWorks;