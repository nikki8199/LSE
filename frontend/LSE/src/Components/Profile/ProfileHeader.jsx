import {
  Avatar,
  Box,
  Paper,
  Typography,
  Stack,
} from "@mui/material";

import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";

function ProfileHeader({ user }) {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        borderRadius: 4,
        mb: 3,
      }}
    >
      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        spacing={3}
        alignItems="center"
      >
        <Avatar
          src={user.profileImage}
          sx={{
            width: 120,
            height: 120,
            bgcolor: "primary.main",
            fontSize: 45,
          }}
        >
          {user.name?.charAt(0)}
        </Avatar>

        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
          >
            {user.name}
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            mt={1}
          >
            <StarIcon sx={{ color: "#FFC107" }} />

            <Typography>
              {user.rating || 0}
            </Typography>
          </Stack>

          {user.city && (
            <Stack
              direction="row"
              spacing={1}
              mt={1}
            >
              <LocationOnIcon color="error" />

              <Typography>
                {user.city}
              </Typography>
            </Stack>
          )}
        </Box>
      </Stack>
    </Paper>
  );
}

export default ProfileHeader;