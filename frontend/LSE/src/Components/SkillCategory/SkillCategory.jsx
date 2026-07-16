import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
} from "@mui/material";

import CodeIcon from "@mui/icons-material/Code";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import LanguageIcon from "@mui/icons-material/Language";

const categories = [
  {
    title: "Programming",
    members: 245,
    icon: <CodeIcon sx={{ fontSize: 45 }} />,
  },
  {
    title: "Cooking",
    members: 180,
    icon: <RestaurantIcon sx={{ fontSize: 45 }} />,
  },
  {
    title: "Music",
    members: 95,
    icon: <MusicNoteIcon sx={{ fontSize: 45 }} />,
  },
  {
    title: "Photography",
    members: 78,
    icon: <CameraAltIcon sx={{ fontSize: 45 }} />,
  },
  {
    title: "Fitness",
    members: 65,
    icon: <FitnessCenterIcon sx={{ fontSize: 45 }} />,
  },
  {
    title: "Languages",
    members: 120,
    icon: <LanguageIcon sx={{ fontSize: 45 }} />,
  },
];

function SkillCategory() {
  return (
    <Box py={10}>
      <Container maxWidth="lg">

        <Typography
          variant="h3"
          align="center"
          fontWeight="bold"
          gutterBottom
        >
          Popular Skill Categories
        </Typography>

        <Typography
          align="center"
          color="text.secondary"
          mb={6}
        >
          Explore the most active learning communities.
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {categories.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.title}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  textAlign: "center",
                  background: "rgba(17, 24, 39, 0.6)",
                  backdropFilter: "blur(14px)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  transition: ".3s",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0px 15px 40px rgba(99, 102, 241, 0.15)",
                    borderColor: "rgba(99, 102, 241, 0.3)",
                  },
                }}
              >
                <Box color="primary.main">
                  {item.icon}
                </Box>

                <Typography
                  variant="h6"
                  fontWeight="bold"
                  mt={2}
                >
                  {item.title}
                </Typography>

                <Typography color="text.secondary">
                  {item.members}+ Members
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

      </Container>
    </Box>
  );
}

export default SkillCategory;