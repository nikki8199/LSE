import {
  Box,
  Typography,
  Paper,
  Chip,
  Stack,
} from "@mui/material";

import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

const trending = [
  {
    name: "React",
    learners: 42,
  },
  {
    name: "Python",
    learners: 38,
  },
  {
    name: "Graphic Design",
    learners: 25,
  },
  {
    name: "Photography",
    learners: 21,
  },
  {
    name: "Video Editing",
    learners: 18,
  },
  {
    name: "Public Speaking",
    learners: 15,
  },
  {
    name: "Cooking",
    learners: 12,
  },
  {
    name: "Digital Marketing",
    learners: 10,
  },
];

function TrendingSkills() {
  return (
    <Paper
      elevation={2}
      sx={{
        mt: 5,
        p: 3,
        borderRadius: 4,
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        mb={3}
      >
        <LocalFireDepartmentIcon
          color="warning"
        />

        <Typography
          variant="h5"
          fontWeight="bold"
        >
          Trending Skills
        </Typography>
      </Stack>

      <Box
        display="flex"
        flexWrap="wrap"
        gap={2}
      >
        {trending.map((skill) => (
          <Chip
            key={skill.name}
            color="primary"
            variant="outlined"
            label={`${skill.name} • ${skill.learners} learners`}
            sx={{
              fontSize: 15,
              p: 2.4,
              borderRadius: 3,
              transition: ".3s",
              "&:hover": {
                bgcolor: "primary.main",
                color: "white",
              },
            }}
          />
        ))}
      </Box>
    </Paper>
  );
}

export default TrendingSkills;