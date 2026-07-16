import React from "react";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import { Person } from "@mui/icons-material";

const users = [
  {
    id: 1,
    name: "Rahul Sharma",
    teaches: ["React", "Node.js"],
    learns: ["Docker", "AWS"],
  },
  {
    id: 2,
    name: "Sophia Wilson",
    teaches: ["MongoDB", "Express"],
    learns: ["Python"],
  },
  {
    id: 3,
    name: "David Lee",
    teaches: ["UI/UX", "Figma"],
    learns: ["React"],
  },
];

function SimilarUsers() {
  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        People with Similar Skills
      </Typography>

      <Grid container spacing={3}>
        {users.map((user) => (
          <Grid item xs={12} md={6} lg={4} key={user.id}>
            <Card
              sx={{
                borderRadius: 3,
                height: "100%",
                transition: ".3s",

                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 8,
                },
              }}
            >
              <CardContent>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  mb={2}
                >
                  <Avatar sx={{ width: 55, height: 55 }}>
                    <Person />
                  </Avatar>

                  <Typography variant="h6" fontWeight={600}>
                    {user.name}
                  </Typography>
                </Stack>

                <Typography
                  variant="subtitle2"
                  color="primary"
                  gutterBottom
                >
                  Skills They Teach
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  mb={2}
                >
                  {user.teaches.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      color="primary"
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Stack>

                <Typography
                  variant="subtitle2"
                  color="secondary"
                  gutterBottom
                >
                  Wants to Learn
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  mb={3}
                >
                  {user.learns.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      color="secondary"
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Stack>

                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                  }}
                >
                  View Profile
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default SimilarUsers;