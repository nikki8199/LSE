import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import { getReceivedRequests, acceptExchangeRequest } from "../../Services/exchangeService";
import { useNavigate } from "react-router-dom";

function RecentRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    try {
      setLoading(true);
      const data = await getReceivedRequests();
      // Filter for Pending requests and limit to top 3
      const pending = (data.requests || [])
        .filter((r) => r.status === "Pending")
        .slice(0, 3);
      setRequests(pending);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  const handleAccept = async (id) => {
    try {
      await acceptExchangeRequest(id);
      alert("Exchange request accepted!");
      loadRequests();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to accept request");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={3}>
        <CircularProgress size={30} />
      </Box>
    );
  }

  if (requests.length === 0) {
    return (
      <Box mt={5}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Recent Skill Requests
        </Typography>
        <Typography color="text.secondary">
          No new skill swap requests. Go to explore to connect with others!
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
        Recent Skill Requests
      </Typography>

      <Stack spacing={2}>
        {requests.map((item) => (
          <Card
            key={item._id}
            sx={{
              borderRadius: 4,
              transition: ".3s",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: 6,
              },
            }}
          >
            <CardContent>
              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{
                  xs: "flex-start",
                  sm: "center",
                }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                >
                  <Avatar sx={{ bgcolor: "primary.main" }} src={item.sender?.profileImage}>
                    {item.sender?.name?.charAt(0)}
                  </Avatar>

                  <Box>
                    <Typography fontWeight="bold">
                      {item.sender?.name}
                    </Typography>

                    <Typography
                      color="text.secondary"
                      fontSize={14}
                    >
                      {new Date(item.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Stack>

                <Box
                  sx={{
                    flex: 1,
                    mx: {
                      sm: 3,
                    },
                  }}
                >
                  <Typography>
                    Wants to learn: <strong>{item.requestedSkill}</strong> • Offers to teach: <strong>{item.offeredSkill}</strong>
                  </Typography>

                  <Typography color="text.secondary" variant="body2">
                    {item.message || "No message provided."}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    size="small"
                    color="success"
                    onClick={() => handleAccept(item._id)}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate("/requests")}
                  >
                    View All
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}

export default RecentRequests;