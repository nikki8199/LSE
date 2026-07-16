import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Stack,
  CircularProgress,
  Chip,
  Paper,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CheckIcon from "@mui/icons-material/Check";
import { getReceivedRequests, getSentRequests, acceptExchangeRequest, completeExchangeRequest } from "../../Services/exchangeService";
import { useNavigate } from "react-router-dom";
import ReviewDialog from "../Profile/ReviewDialog";
import ComplaintModal from "./ComplaintModal";

function RecentRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dialog & Modal states for review and report
  const [selectedExchangeId, setSelectedExchangeId] = useState("");
  const [selectedPartnerName, setSelectedPartnerName] = useState("");
  const [selectedPartnerEmail, setSelectedPartnerEmail] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    try {
      setLoading(true);
      const recData = await getReceivedRequests();
      const sentData = await getSentRequests();

      const recList = (recData.requests || []).map((r) => ({ ...r, direction: "received" }));
      const sentList = (sentData.requests || []).map((r) => ({ ...r, direction: "sent" }));

      // Combine and filter: 
      // - Pending received requests (so we can accept them)
      // - Accepted exchanges (both received and sent, so we can connect/chat/complete)
      // - Completed exchanges (so we can review/report them!)
      const combined = [...recList, ...sentList]
        .filter((r) => (r.direction === "received" && r.status === "Pending") || r.status === "Accepted" || r.status === "Completed")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4);

      setRequests(combined);
    } catch (err) {
      console.error("Error loading dashboard requests:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleAccept = async (id, senderId) => {
    try {
      await acceptExchangeRequest(id);
      alert("Exchange request accepted!");
      if (senderId) {
        navigate(`/profile/${senderId}`);
      } else {
        loadRequests();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to accept request");
    }
  };

  const handleComplete = async (id) => {
    try {
      await completeExchangeRequest(id);
      alert("Exchange marked as completed! You can now leave a review for your partner.");
      loadRequests();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to complete exchange");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "Accepted":
        return "success";
      case "Completed":
        return "info";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
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
          No active exchanges or pending requests yet. Go to explore to connect with others!
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box mt={5}>
        <Typography
          variant="h5"
          fontWeight="bold"
          mb={3}
        >
          Recent Skill Requests & Active Exchanges
        </Typography>

        <Stack spacing={2}>
          {requests.map((item) => {
            const isReceived = item.direction === "received";
            const partner = isReceived ? item.sender : item.receiver;

            return (
              <Card
                key={item._id}
                sx={{
                  borderRadius: 4,
                  bgcolor: "rgba(10, 15, 30, 0.45)",
                  border: "1px solid rgba(6, 182, 212, 0.15)",
                  backdropFilter: "blur(20px)",
                  transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    borderColor: "rgba(6, 182, 212, 0.45)",
                    boxShadow: "0 0 15px rgba(6, 182, 212, 0.2)",
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
                      <Avatar sx={{ bgcolor: "primary.main", border: "1px solid rgba(6, 182, 212, 0.3)" }} src={partner?.profileImage}>
                        {partner?.name?.charAt(0)}
                      </Avatar>

                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography fontWeight="bold">
                            {partner?.name || "SkillSwap Member"}
                          </Typography>
                          <Chip 
                            label={item.status} 
                            size="small" 
                            color={getStatusColor(item.status)}
                            sx={{ height: 18, fontSize: 10, fontWeight: "bold" }}
                          />
                        </Stack>

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
                      <Typography variant="body2">
                        Wants to learn: <strong>{item.requestedSkill}</strong> • Offers to teach: <strong>{item.offeredSkill}</strong>
                      </Typography>

                      <Typography color="text.secondary" variant="caption" display="block" sx={{ mt: 0.5 }}>
                        Message: "{item.message || "No message provided."}"
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1.5}>
                      {item.status === "Pending" ? (
                        <>
                          <Button
                            variant="contained"
                            size="small"
                            color="success"
                            startIcon={<CheckIcon />}
                            onClick={() => handleAccept(item._id, item.sender?._id)}
                            sx={{ borderRadius: 2 }}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => navigate("/requests")}
                            sx={{ borderRadius: 2 }}
                          >
                            View All
                          </Button>
                        </>
                      ) : item.status === "Accepted" ? (
                        <>
                          <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            startIcon={<ChatIcon />}
                            onClick={() => navigate(`/messages?chat=${partner?._id}`)}
                            sx={{ borderRadius: 2 }}
                          >
                            Chat
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            color="success"
                            onClick={() => handleComplete(item._id)}
                            sx={{ borderRadius: 2 }}
                          >
                            Complete
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="contained"
                            size="small"
                            color="secondary"
                            onClick={() => {
                              setSelectedExchangeId(item._id);
                              setSelectedPartnerName(partner?.name);
                              setReviewOpen(true);
                            }}
                            sx={{ borderRadius: 2 }}
                          >
                            Give Review
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            onClick={() => {
                              setSelectedPartnerEmail(partner?.email);
                              setReportOpen(true);
                            }}
                            sx={{ borderRadius: 2 }}
                          >
                            Report
                          </Button>
                        </>
                      )}
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      </Box>

      {/* Peer Review Dialog */}
      <ReviewDialog
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        exchangeId={selectedExchangeId}
        partnerName={selectedPartnerName}
        onSubmitSuccess={loadRequests}
      />

      {/* Partner Report Complaint Modal */}
      <ComplaintModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        initialTargetEmail={selectedPartnerEmail}
        onSubmitSuccess={loadRequests}
      />
    </>
  );
}

export default RecentRequests;