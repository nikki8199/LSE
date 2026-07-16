import {
  Paper,
  Typography,
} from "@mui/material";

function AboutSection({ user }) {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 4,
        mt: 3,
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        mb={2}
      >
        About
      </Typography>

      <Typography color="text.secondary">
        {user.bio || "No bio available."}
      </Typography>
    </Paper>
  );
}

export default AboutSection;