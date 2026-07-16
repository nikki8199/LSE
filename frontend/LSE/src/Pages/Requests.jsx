import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Avatar,
  Button,
  Stack,
  Chip,
  CircularProgress,
  Divider,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChatIcon from "@mui/icons-material/Chat";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../Components/DashboardNavbar/DashboardNavbar";
import Sidebar from "../Components/SideBar/SideBar";
import ReviewDialog from "../Components/Profile/ReviewDialog";
import ComplaintModal from "../Components/Dashboard/ComplaintModal";
import {
  getReceivedRequests,
  getSentRequests,
  acceptExchangeRequest,
  rejectExchangeRequest,
  completeExchangeRequest,
} from "../Services/exchangeService";

function Requests() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dialog & Modal states for review and report
  const [selectedExchangeId, setSelectedExchangeId] = useState("");
  const [selectedPartnerName, setSelectedPartnerName] = useState("");
  const [selectedPartnerEmail, setSelectedPartnerEmail] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const recData = await getReceivedRequests();
      const sentData = await getSentRequests();
      setReceived(recData.requests || []);
      setSent(sentData.requests || []);
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAccept = async (id, senderId) => {
    try {
      await acceptExchangeRequest(id);
      alert("Request accepted successfully!");
      if (senderId) {
        navigate(`/profile/${senderId}`);
      } else {
        fetchRequests();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to accept request");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectExchangeRequest(id);
      alert("Request rejected successfully!");
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject request");
    }
  };

  const handleComplete = async (id) => {
    try {
      await completeExchangeRequest(id);
      alert("Exchange marked as completed! You can now leave a review for your partner.");
      fetchRequests();
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
      case "Rejected":
        return "error";
      case "Completed":
        return "info";
      default:
        return "default";
    }
  };

  const renderRequestCard = (req, type) => {
    const isReceived = type === "received";
    const partner = isReceived ? req.sender : req.receiver;

    return (
      <Card key={req._id} sx={{ borderRadius: 4, mb: 3, boxShadow: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            {/* Partner Details */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                src={partner?.profileImage}
                sx={{ width: 50, height: 50, bgcolor: "primary.main" }}
              >
                {partner?.name?.charAt(0)}
              </Avatar>
              <Box>
                <Typography fontWeight="bold" fontSize={18}>
                  {partner?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {partner?.email}
                </Typography>
              </Box>
            </Stack>

            {/* Status Chip */}
            <Chip
              label={req.status}
              color={getStatusColor(req.status)}
              size="small"
              sx={{ fontWeight: "bold" }}
            />
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Requested Skill (to learn):
              </Typography>
              <Typography fontWeight="bold" color="primary.main">
                {req.requestedSkill}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Offered Skill (to teach):
              </Typography>
              <Typography fontWeight="bold" color="secondary.main">
                {req.offeredSkill}
              </Typography>
            </Grid>
          </Grid>

          {req.message && (
            <Box
              sx={{
                bgcolor: "#F0F4F8",
                p: 2,
                borderRadius: 2,
                mb: 2,
                fontStyle: "italic",
              }}
            >
              <Typography variant="body2">"{req.message}"</Typography>
            </Box>
          )}

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            sx={{ color: "text.secondary", mb: 2 }}
          >
            {req.preferredDate && (
              <Stack direction="row" spacing={1} alignItems="center">
                <CalendarMonthIcon fontSize="small" />
                <Typography variant="body2">
                  {new Date(req.preferredDate).toLocaleDateString()}
                </Typography>
              </Stack>
            )}
            <Stack direction="row" spacing={1} alignItems="center">
              <VideoCameraBackIcon fontSize="small" />
              <Typography variant="body2">Mode: {req.meetingMode}</Typography>
            </Stack>
          </Stack>

          {/* Action Buttons for Received & Pending */}
          {isReceived && req.status === "Pending" && (
            <Stack direction="row" spacing={2} mt={3}>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckIcon />}
                onClick={() => handleAccept(req._id, req.sender?._id)}
                sx={{ borderRadius: 2 }}
              >
                Accept
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<CloseIcon />}
                onClick={() => handleReject(req._id)}
                sx={{ borderRadius: 2 }}
              >
                Reject
              </Button>
            </Stack>
          )}

          {/* Action Buttons for Accepted requests */}
          {req.status === "Accepted" && (
            <Stack direction="row" spacing={2} mt={3}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<ChatIcon />}
                onClick={() => navigate(`/messages?chat=${partner?._id}`)}
                sx={{ borderRadius: 2 }}
              >
                Chat
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => handleComplete(req._id)}
                sx={{ borderRadius: 2 }}
              >
                Complete
              </Button>
            </Stack>
          )}

          {/* Action Buttons for Completed requests */}
          {req.status === "Completed" && (
            <Stack direction="row" spacing={2} mt={3}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  setSelectedExchangeId(req._id);
                  setSelectedPartnerName(partner?.name);
                  setReviewOpen(true);
                }}
                sx={{ borderRadius: 2 }}
              >
                Give Review
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  setSelectedPartnerEmail(partner?.email);
                  setReportOpen(true);
                }}
                sx={{ borderRadius: 2 }}
              >
                Report User
              </Button>
            </Stack>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <DashboardNavbar />
      <Box sx={{ display: "flex", bgcolor: "transparent", minHeight: "100vh", pt: 8 }}>
        <Sidebar />

        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ mb: 3 }}
          >
            Back
          </Button>

          <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
            <Typography variant="h4" fontWeight="bold" mb={3}>
              Exchange Requests
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label={`Received (${received.length})`} />
                <Tab label={`Sent (${sent.length})`} />
              </Tabs>
            </Box>

            {loading ? (
              <Box display="flex" justifyContent="center" py={5}>
                <CircularProgress />
              </Box>
            ) : tabValue === 0 ? (
              received.length === 0 ? (
                <Typography color="text.secondary">No received requests yet.</Typography>
              ) : (
                received.map((req) => renderRequestCard(req, "received"))
              )
            ) : sent.length === 0 ? (
              <Typography color="text.secondary">No sent requests yet.</Typography>
            ) : (
              sent.map((req) => renderRequestCard(req, "sent"))
            )}
          </Paper>
        </Container>
      </Box>

      {/* Peer Review Dialog */}
      <ReviewDialog
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        exchangeId={selectedExchangeId}
        partnerName={selectedPartnerName}
        onSubmitSuccess={fetchRequests}
      />

      {/* Partner Report Complaint Modal */}
      <ComplaintModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        initialTargetEmail={selectedPartnerEmail}
        onSubmitSuccess={fetchRequests}
      />
    </>
  );
}

export default Requests;
