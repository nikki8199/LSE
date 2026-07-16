import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Chip,
  Stack,
  Button,
  Box,
} from "@mui/material";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import PersonIcon from "@mui/icons-material/Person";
import ChatIcon from "@mui/icons-material/Chat";

import { useNavigate } from "react-router-dom";

function UserCard({ user }) {
  const navigate = useNavigate();

  return (
    <Card
      elevation={4}
      sx={{
        borderRadius: 4,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: ".3s",

        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: 10,
        },
      }}
    >
      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack
          spacing={2}
          alignItems="center"
        >
          <Avatar
            src={user.profileImage}
            sx={{
              width: 80,
              height: 80,
              bgcolor: "primary.main",
              fontSize: 30,
            }}
          >
            {user.name?.charAt(0)}
          </Avatar>

          <Typography
            variant="h6"
            fontWeight="bold"
            textAlign="center"
          >
            {user.name}
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >
            <StarIcon
              sx={{
                color: "#FFC107",
                fontSize: 20,
              }}
            />

            <Typography>
              {user.rating || "New Member"}
            </Typography>
          </Stack>

          {user.city && (
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
            >
              <LocationOnIcon
                color="error"
                fontSize="small"
              />

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {user.city}
              </Typography>
            </Stack>
          )}
        </Stack>

        <Box mt={3}>
          <Typography
            fontWeight="bold"
            mb={1}
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
        </Box>

        <Box mt={2}>
          <Typography
            fontWeight="bold"
            mb={1}
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
        </Box>

        <Stack
          direction="row"
          spacing={1.5}
          mt="auto"
          pt={3}
          width="100%"
        >
          <Button
            fullWidth
            variant="contained"
            startIcon={<PersonIcon />}
            onClick={() =>
              navigate(`/profile/${user._id}`)
            }
            sx={{
              borderRadius: 3,
            }}
          >
            Profile
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<ChatIcon />}
            onClick={() =>
              navigate(`/messages?chat=${user._id}`)
            }
            sx={{
              borderRadius: 3,
            }}
          >
            Chat
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default UserCard;