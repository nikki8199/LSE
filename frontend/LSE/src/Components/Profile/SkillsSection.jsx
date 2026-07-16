import {
  Paper,
  Typography,
  Chip,
  Grid,
  Box,
} from "@mui/material";

function SkillsSection({ user }) {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 4,
        mt: 3,
      }}
    >
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography
            variant="h6"
            fontWeight="bold"
            mb={2}
          >
            Skills Offered
          </Typography>

          <Box>
            {user.skillsOffered?.map((skill) => (
              <Chip
                key={skill}
                label={skill}
                color="primary"
                sx={{
                  mr: 1,
                  mb: 1,
                }}
              />
            ))}
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography
            variant="h6"
            fontWeight="bold"
            mb={2}
          >
            Wants To Learn
          </Typography>

          <Box>
            {user.skillsNeeded?.map((skill) => (
              <Chip
                key={skill}
                label={skill}
                color="secondary"
                sx={{
                  mr: 1,
                  mb: 1,
                }}
              />
            ))}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default SkillsSection;