import { useEffect, useState } from "react";
import { exploreUsers } from "../../Services/userService";
import { useNavigate } from "react-router-dom";
import ChatIcon from "@mui/icons-material/Chat";

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";

function RecommendedSkills() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const data = await exploreUsers();
      setUsers(data.users);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        py={5}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (users.length === 0) {
    return (
      <Box mt={5}>
        <Typography
          variant="h5"
          fontWeight="bold"
          mb={2}
        >
          Recommended Users
        </Typography>

        <Typography color="text.secondary">
          No users found. Ask a friend to join SkillSwap 😊
        </Typography>
      </Box>
    );
  }

  return (
    <Box mt={5}>
      <Typography
        variant="h5"
        fontWeight="bold"
        mb={3}
      >
        Recommended Users
      </Typography>

      <Grid container spacing={3}>
        {users.map((user) => (
          <Grid
            item
            xs={12}
            sm={6}
            lg={4}
            key={user._id}
          >
            <Card
              sx={{
                borderRadius: 4,
                height: "100%",
                transition: ".3s",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: 8,
                },
              }}
            >
              <CardContent>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                >
                  <Avatar
                    src={user.profileImage}
                    sx={{
                      width: 60,
                      height: 60,
                      bgcolor: "primary.main",
                    }}
                  >
                    {user.name?.charAt(0)}
                  </Avatar>

                  <Box>
                    <Typography
                      fontWeight="bold"
                      fontSize={20}
                    >
                      {user.name}
                    </Typography>

                    <Typography color="text.secondary">
                      ⭐ {user.rating || 0}
                    </Typography>

                    {user.city && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        📍 {user.city}
                      </Typography>
                    )}
                  </Box>
                </Stack>

                <Typography
                  mt={3}
                  fontWeight="bold"
                >
                  Skills Offered
                </Typography>

                <Box mt={1}>
                  {user.skillsOffered?.length > 0 ? (
                    user.skillsOffered.map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        color="primary"
                        sx={{
                          mr: 1,
                          mb: 1,
                        }}
                      />
                    ))
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      No skills added
                    </Typography>
                  )}
                </Box>

                <Typography
                  mt={2}
                  fontWeight="bold"
                >
                  Wants To Learn
                </Typography>

                <Box mt={1}>
                  {user.skillsNeeded?.length > 0 ? (
                    user.skillsNeeded.map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        color="secondary"
                        sx={{
                          mr: 1,
                          mb: 1,
                        }}
                      />
                    ))
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      No skills added
                    </Typography>
                  )}
                </Box>

                <Stack direction="row" spacing={1.5} mt={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => navigate(`/profile/${user._id}`)}
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
                    onClick={() => navigate(`/messages?chat=${user._id}`)}
                    sx={{
                      borderRadius: 3,
                    }}
                  >
                    Chat
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default RecommendedSkills;