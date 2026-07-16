import {
  Box,
  Container,
  Typography,
  Grid,
} from "@mui/material";

import UserCard from "../UserCard/UserCard";

const users = [
  {
    id: 1,
    name: "Anil Kumar",
    title: "Full Stack Developer",
    location: "Hyderabad",
    rating: 5,
    swaps: 42,
    success: 98,
    skillsOffered: ["React", "Node", "MongoDB"],
    skillsNeeded: ["Cooking", "Guitar"],
  },
  {
    id: 2,
    name: "Priya Sharma",
    title: "UI/UX Designer",
    location: "Bengaluru",
    rating: 4.5,
    swaps: 31,
    success: 96,
    skillsOffered: ["Figma", "Photoshop"],
    skillsNeeded: ["Python", "Public Speaking"],
  },
  {
    id: 3,
    name: "Rahul Verma",
    title: "Fitness Coach",
    location: "Chennai",
    rating: 4.8,
    swaps: 28,
    success: 97,
    skillsOffered: ["Yoga", "Fitness"],
    skillsNeeded: ["React", "English"],
  },
];

function FeaturedUsers() {
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
          align="center"
          fontWeight="bold"
          mb={2}
        >
          Meet Our Community
        </Typography>

        <Typography
          align="center"
          color="text.secondary"
          mb={6}
        >
          Discover skilled people who are ready to teach,
          learn, and collaborate with you.
        </Typography>

        <Grid container spacing={4} alignItems="stretch" justifyContent="center">
          {users.map((user) => (
            <Grid
              key={user.id}
              size={{ xs: 12, sm: 6, md: 4 }}
              sx={{
                display: "flex",
              }}
            >
              <UserCard user={user} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default FeaturedUsers;