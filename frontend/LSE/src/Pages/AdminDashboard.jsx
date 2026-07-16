import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Stack,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Chip,
  Alert,
  Rating,
} from "@mui/material";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AssessmentIcon from "@mui/icons-material/Assessment";
import HandshakeIcon from "@mui/icons-material/Handshake";
import PlayCircleOutlinedIcon from "@mui/icons-material/PlayCircleOutlined";
import ReportIcon from "@mui/icons-material/Report";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import StarRateIcon from "@mui/icons-material/StarRate";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardNavbar from "../Components/DashboardNavbar/DashboardNavbar";
import Sidebar from "../Components/SideBar/SideBar";

function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const tabQuery = searchParams.get("tab") || "analytics";

  const tabMap = {
    analytics: 0,
    users: 1,
    reviews: 2,
    complaints: 3,
    videos: 4
  };

  const tabValue = tabMap[tabQuery] !== undefined ? tabMap[tabQuery] : 0;

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [videos, setVideos] = useState([]);

  // Check if admin
  const isAdmin = user && user.role === "admin";

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Load admin stats
      const statsRes = await axios.get("http://localhost:5000/users/admin/stats", config);
      setStats(statsRes.data.stats);

      // Load admin users list
      const usersRes = await axios.get("http://localhost:5000/users/admin/users", config);
      setUsers(usersRes.data.users || []);

      // Load admin reviews list
      const reviewsRes = await axios.get("http://localhost:5000/review/admin", config);
      setReviews(reviewsRes.data.reviews || []);

      // Load admin complaints list
      const complaintsRes = await axios.get("http://localhost:5000/complaints/admin", config);
      setComplaints(complaintsRes.data.complaints || []);

      // Load shared videos
      const videoRes = await axios.get("http://localhost:5000/videos", config);
      setVideos(videoRes.data.videos || []);

    } catch (err) {
      console.error("Error loading admin console:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const response = await axios.patch(
        `http://localhost:5000/users/admin/users/toggle/${userId}`,
        {},
        config
      );

      alert(response.data.message);
      setUsers(
        users.map((u) =>
          u._id === userId ? { ...u, isActive: !u.isActive } : u
        )
      );
    } catch (err) {
      alert("Failed to toggle status");
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm("Moderate and delete this video?")) return;

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.delete(`http://localhost:5000/videos/${videoId}`, config);
      setVideos(videos.filter((v) => v._id !== videoId));
      alert("Video moderated and deleted successfully!");
      // Refresh stats
      const statsRes = await axios.get("http://localhost:5000/users/admin/stats", config);
      setStats(statsRes.data.stats);
    } catch (err) {
      alert("Failed to delete video");
    }
  };

  const handleToggleComplaintStatus = async (complaintId) => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const res = await axios.patch(
        `http://localhost:5000/complaints/admin/${complaintId}/status`,
        {},
        config
      );

      alert(res.data.message);
      setComplaints(
        complaints.map((c) =>
          c._id === complaintId
            ? { ...c, status: c.status === "pending" ? "resolved" : "pending" }
            : c
        )
      );
      
      const statsRes = await axios.get("http://localhost:5000/users/admin/stats", config);
      setStats(statsRes.data.stats);
    } catch (err) {
      alert("Failed to toggle complaint status");
    }
  };

  const handleDeleteComplaint = async (complaintId) => {
    if (!window.confirm("Delete this complaint log permanently?")) return;

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.delete(`http://localhost:5000/complaints/admin/${complaintId}`, config);
      setComplaints(complaints.filter((c) => c._id !== complaintId));
      alert("Complaint deleted successfully!");

      const statsRes = await axios.get("http://localhost:5000/users/admin/stats", config);
      setStats(statsRes.data.stats);
    } catch (err) {
      alert("Failed to delete complaint");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Moderate and delete this review?")) return;

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.delete(`http://localhost:5000/review/admin/${reviewId}`, config);
      setReviews(reviews.filter((r) => r._id !== reviewId));
      alert("Review deleted successfully!");

      const statsRes = await axios.get("http://localhost:5000/users/admin/stats", config);
      setStats(statsRes.data.stats);
    } catch (err) {
      alert("Failed to delete review");
    }
  };

  if (!isAdmin) {
    return (
      <Container sx={{ mt: 10 }}>
        <Alert severity="error">
          Access Denied: Only administrators are authorized to access this panel.
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/")} sx={{ mt: 3 }}>
          Return Home
        </Button>
      </Container>
    );
  }

  // Calculate chart max heights
  const maxRegistrationCount = stats?.recentRegistrations?.length > 0 
    ? Math.max(...stats.recentRegistrations.map(r => r.count), 5) 
    : 5;

  return (
    <>
      <DashboardNavbar />
      <Box sx={{ display: "flex", bgcolor: "transparent", minHeight: "100vh", pt: 8 }}>
        <Sidebar />

        <Container maxWidth="xl" sx={{ py: 4, flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={2} alignItems="center" mb={4}>
            <SupervisedUserCircleIcon color="primary" sx={{ fontSize: 40, filter: "drop-shadow(0 0 8px rgba(6,182,212,0.4))" }} />
            <Typography variant="h4" fontWeight="extrabold" sx={{ textTransform: "uppercase", tracking: 1.5, background: "linear-gradient(90deg, #00F2FE 0%, #4FACFE 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Admin Command Console
            </Typography>
          </Stack>

          {loading ? (
            <Box display="flex" justifyContent="center" py={5}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Analytics summary widgets */}
              <Grid container spacing={3} mb={5}>
                <Grid item xs={12} sm={6} md={2.4}>
                  <Card sx={{ display: "flex", alignItems: "center", p: 2.5, borderRadius: 4, bgcolor: "rgba(10, 15, 30, 0.45)", border: "1px solid rgba(6, 182, 212, 0.2)", boxShadow: "0 0 15px rgba(6, 182, 212, 0.1)", backdropFilter: "blur(12px)" }}>
                    <Avatar sx={{ bgcolor: "rgba(6, 182, 212, 0.12)", border: "1px solid rgba(6, 182, 212, 0.4)", color: "#06B6D4", mr: 2 }}><SupervisedUserCircleIcon /></Avatar>
                    <Box>
                      <Typography color="text.secondary" variant="caption" fontWeight="bold">Total Members</Typography>
                      <Typography variant="h4" fontWeight="bold" sx={{ color: "#06B6D4", mt: 0.5 }}>{stats?.totalUsers}</Typography>
                    </Box>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                  <Card sx={{ display: "flex", alignItems: "center", p: 2.5, borderRadius: 4, bgcolor: "rgba(10, 15, 30, 0.45)", border: "1px solid rgba(16, 185, 129, 0.2)", boxShadow: "0 0 15px rgba(16, 185, 129, 0.1)", backdropFilter: "blur(12px)" }}>
                    <Avatar sx={{ bgcolor: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.4)", color: "#10B981", mr: 2 }}><HandshakeIcon /></Avatar>
                    <Box>
                      <Typography color="text.secondary" variant="caption" fontWeight="bold">Skill Exchanges</Typography>
                      <Typography variant="h4" fontWeight="bold" sx={{ color: "#10B981", mt: 0.5 }}>{stats?.totalRequests}</Typography>
                    </Box>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                  <Card sx={{ display: "flex", alignItems: "center", p: 2.5, borderRadius: 4, bgcolor: "rgba(10, 15, 30, 0.45)", border: "1px solid rgba(245, 158, 11, 0.2)", boxShadow: "0 0 15px rgba(245, 158, 11, 0.1)", backdropFilter: "blur(12px)" }}>
                    <Avatar sx={{ bgcolor: "rgba(245, 158, 11, 0.12)", border: "1px solid rgba(245, 158, 11, 0.4)", color: "#F59E0B", mr: 2 }}><PlayCircleOutlinedIcon /></Avatar>
                    <Box>
                      <Typography color="text.secondary" variant="caption" fontWeight="bold">Shared Videos</Typography>
                      <Typography variant="h4" fontWeight="bold" sx={{ color: "#F59E0B", mt: 0.5 }}>{stats?.totalVideos}</Typography>
                    </Box>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                  <Card sx={{ display: "flex", alignItems: "center", p: 2.5, borderRadius: 4, bgcolor: "rgba(10, 15, 30, 0.45)", border: "1px solid rgba(139, 92, 246, 0.2)", boxShadow: "0 0 15px rgba(139, 92, 246, 0.1)", backdropFilter: "blur(12px)" }}>
                    <Avatar sx={{ bgcolor: "rgba(139, 92, 246, 0.12)", border: "1px solid rgba(139, 92, 246, 0.4)", color: "#8B5CF6", mr: 2 }}><StarRateIcon /></Avatar>
                    <Box>
                      <Typography color="text.secondary" variant="caption" fontWeight="bold">Total Reviews</Typography>
                      <Typography variant="h4" fontWeight="bold" sx={{ color: "#8B5CF6", mt: 0.5 }}>{stats?.totalReviews}</Typography>
                    </Box>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                  <Card sx={{ display: "flex", alignItems: "center", p: 2.5, borderRadius: 4, bgcolor: "rgba(10, 15, 30, 0.45)", border: "1px solid rgba(244, 63, 94, 0.2)", boxShadow: "0 0 15px rgba(244, 63, 94, 0.1)", backdropFilter: "blur(12px)" }}>
                    <Avatar sx={{ bgcolor: "rgba(244, 63, 94, 0.12)", border: "1px solid rgba(244, 63, 94, 0.4)", color: "#F43F5E", mr: 2 }}><ReportIcon /></Avatar>
                    <Box>
                      <Typography color="text.secondary" variant="caption" fontWeight="bold">Active Complaints</Typography>
                      <Typography variant="h4" fontWeight="bold" sx={{ color: "#F43F5E", mt: 0.5 }}>{stats?.activeComplaints}</Typography>
                    </Box>
                  </Card>
                </Grid>
              </Grid>

              {/* Management Panels */}
              <Paper elevation={3} sx={{ borderRadius: 4, overflow: "hidden", mb: 4, bgcolor: "rgba(10, 15, 30, 0.45)", border: "1px solid rgba(6, 182, 212, 0.18)", boxShadow: "0 0 25px rgba(6, 182, 212, 0.15)", backdropFilter: "blur(24px)" }}>

                {/* Tab 0: Analytics & Visual Metrics */}
                {tabValue === 0 && (
                  <Box p={4}>
                    <Grid container spacing={4}>
                      {/* Registration Timeline Chart */}
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" fontWeight="bold" mb={3} sx={{ color: "text.primary" }}>
                          Member Signups (Last 7 Days)
                        </Typography>
                        {stats?.recentRegistrations?.length === 0 ? (
                          <Box display="flex" height={220} alignItems="center" justifyContent="center" bgcolor="rgba(255,255,255,0.02)" borderRadius={3}>
                            <Typography color="text.secondary" variant="body2">No recent registrations</Typography>
                          </Box>
                        ) : (
                          <Box sx={{ display: "flex", alignItems: "flex-end", height: 220, gap: 2, pt: 2, px: 2 }}>
                            {stats.recentRegistrations.map((item, idx) => {
                              const pct = (item.count / maxRegistrationCount) * 100;
                              return (
                                <Box key={idx} sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                                  <Typography variant="caption" fontWeight="bold" color="primary.main" sx={{ mb: 0.5 }}>{item.count}</Typography>
                                  <Box sx={{
                                    width: "100%",
                                    height: `${pct * 1.5}px`,
                                    maxHeight: "150px",
                                    background: "linear-gradient(180deg, #00F2FE 0%, #4FACFE 100%)",
                                    borderRadius: "4px 4px 0 0",
                                    boxShadow: "0 0 10px rgba(6, 182, 212, 0.45)",
                                    transition: "all 0.4s ease-in-out",
                                    "&:hover": {
                                      background: "linear-gradient(180deg, #4FACFE 0%, #00F2FE 100%)",
                                      boxShadow: "0 0 15px rgba(6, 182, 212, 0.7)",
                                    }
                                  }} />
                                  <Typography variant="caption" sx={{ fontSize: 9, mt: 1, color: "text.secondary" }}>
                                    {item._id.split("-").slice(1).join("/")}
                                  </Typography>
                                </Box>
                              );
                            })}
                          </Box>
                        )}
                      </Grid>

                      {/* Status metrics grid */}
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" fontWeight="bold" mb={3} sx={{ color: "text.primary" }}>
                          Exchanges Status Breakdown
                        </Typography>
                        <Stack spacing={2.5}>
                          {["Pending", "Accepted", "Completed", "Rejected"].map(status => {
                            const match = stats?.exchangesByStatus?.find(e => e._id === status);
                            const count = match ? match.count : 0;
                            const total = stats?.totalRequests || 1;
                            const pct = (count / total) * 100;
                            
                            const colorMap = {
                              Pending: "linear-gradient(90deg, #F59E0B 0%, #D97706 100%)",
                              Accepted: "linear-gradient(90deg, #06B6D4 0%, #0891B2 100%)",
                              Completed: "linear-gradient(90deg, #10B981 0%, #059669 100%)",
                              Rejected: "linear-gradient(90deg, #F43F5E 0%, #E11D48 100%)"
                            };

                            const shadowMap = {
                              Pending: "0 0 8px rgba(245, 158, 11, 0.4)",
                              Accepted: "0 0 8px rgba(6, 182, 212, 0.4)",
                              Completed: "0 0 8px rgba(16, 185, 129, 0.4)",
                              Rejected: "0 0 8px rgba(244, 63, 94, 0.4)"
                            };

                            return (
                              <Box key={status}>
                                <Stack direction="row" justifyContent="space-between" mb={0.5}>
                                  <Typography variant="body2" fontWeight="bold">{status}</Typography>
                                  <Typography variant="body2" color="text.secondary">{count} ({Math.round(pct)}%)</Typography>
                                </Stack>
                                <Box sx={{ width: "100%", height: 8, bgcolor: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
                                  <Box sx={{ width: `${pct}%`, height: "100%", background: colorMap[status], borderRadius: 4, boxShadow: shadowMap[status] }} />
                                </Box>
                              </Box>
                            );
                          })}
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* Tab 1: Users Directory */}
                {tabValue === 1 && (
                  <TableContainer sx={{ maxHeight: "65vh" }}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold", bgcolor: "rgba(10, 15, 30, 0.85)", color: "primary.main", borderBottom: "1px solid rgba(6, 182, 212, 0.3)" }}>Name</TableCell>
                          <TableCell sx={{ fontWeight: "bold", bgcolor: "rgba(10, 15, 30, 0.85)", color: "primary.main", borderBottom: "1px solid rgba(6, 182, 212, 0.3)" }}>Email</TableCell>
                          <TableCell sx={{ fontWeight: "bold", bgcolor: "rgba(10, 15, 30, 0.85)", color: "primary.main", borderBottom: "1px solid rgba(6, 182, 212, 0.3)" }}>Verified</TableCell>
                          <TableCell sx={{ fontWeight: "bold", bgcolor: "rgba(10, 15, 30, 0.85)", color: "primary.main", borderBottom: "1px solid rgba(6, 182, 212, 0.3)" }}>Status</TableCell>
                          <TableCell sx={{ fontWeight: "bold", bgcolor: "rgba(10, 15, 30, 0.85)", color: "primary.main", borderBottom: "1px solid rgba(6, 182, 212, 0.3)" }}>Role</TableCell>
                          <TableCell sx={{ fontWeight: "bold", bgcolor: "rgba(10, 15, 30, 0.85)", color: "primary.main", borderBottom: "1px solid rgba(6, 182, 212, 0.3)" }}>Joined</TableCell>
                          <TableCell sx={{ fontWeight: "bold", bgcolor: "rgba(10, 15, 30, 0.85)", color: "primary.main", borderBottom: "1px solid rgba(6, 182, 212, 0.3)" }} align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users.map((item) => (
                          <TableRow key={item._id} sx={{ "&:hover": { bgcolor: "rgba(6, 182, 212, 0.04)" } }}>
                            <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                              <Stack direction="row" spacing={1.5} alignItems="center">
                                <Avatar src={item.profileImage} sx={{ width: 34, height: 34, bgcolor: "primary.main", border: "1px solid rgba(6, 182, 212, 0.3)" }}>
                                  {item.name?.charAt(0)}
                                </Avatar>
                                <Typography fontWeight="bold">{item.name}</Typography>
                              </Stack>
                            </TableCell>
                            <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{item.email}</TableCell>
                            <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                              <Chip
                                label={item.isVerified ? "Verified" : "Pending"}
                                color={item.isVerified ? "success" : "default"}
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                              <Chip
                                label={item.isActive ? "Active" : "Suspended"}
                                color={item.isActive ? "success" : "error"}
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell sx={{ textTransform: "capitalize", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{item.role}</TableCell>
                            <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell align="center" sx={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                              {item.role !== "admin" ? (
                                <Button
                                  variant="outlined"
                                  size="small"
                                  color={item.isActive ? "error" : "success"}
                                  startIcon={item.isActive ? <LockIcon /> : <LockOpenIcon />}
                                  onClick={() => handleToggleUserStatus(item._id)}
                                  sx={{ borderRadius: 2 }}
                                >
                                  {item.isActive ? "Suspend" : "Activate"}
                                </Button>
                              ) : (
                                <Typography variant="caption" color="warning.main" fontWeight="bold">Root Admin</Typography>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}

                {/* Tab 2: User Reviews Moderation */}
                {tabValue === 2 && (
                  <TableContainer sx={{ maxHeight: "65vh" }}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold", bgcolor: "rgba(10, 15, 30, 0.85)", color: "primary.main", borderBottom: "1px solid rgba(6, 182, 212, 0.3)" }}>Reviewer</TableCell>
                          <TableCell sx={{ fontWeight: "bold", bgcolor: "rgba(10, 15, 30, 0.85)", color: "primary.main", borderBottom: "1px solid rgba(6, 182, 212, 0.3)" }}>Reviewee</TableCell>
                          <TableCell sx={{ fontWeight: "bold", bgcolor: "rgba(10, 15, 30, 0.85)", color: "primary.main", borderBottom: "1px solid rgba(6, 182, 212, 0.3)" }}>Rating</TableCell>
                          <TableCell sx={{ fontWeight: "bold", bgcolor: "rgba(10, 15, 30, 0.85)", color: "primary.main", borderBottom: "1px solid rgba(6, 182, 212, 0.3)" }}>Review Text</TableCell>
                          <TableCell sx={{ fontWeight: "bold", bgcolor: "rgba(10, 15, 30, 0.85)", color: "primary.main", borderBottom: "1px solid rgba(6, 182, 212, 0.3)" }}>Date</TableCell>
                          <TableCell sx={{ fontWeight: "bold", bgcolor: "rgba(10, 15, 30, 0.85)", color: "primary.main", borderBottom: "1px solid rgba(6, 182, 212, 0.3)" }} align="center">Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {reviews.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} align="center" sx={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>No reviews found.</TableCell>
                          </TableRow>
                        ) : (
                          reviews.map((rev) => (
                            <TableRow key={rev._id} sx={{ "&:hover": { bgcolor: "rgba(6, 182, 212, 0.04)" } }}>
                              <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                <Typography fontWeight="bold">{rev.reviewer?.name || "Deleted User"}</Typography>
                                <Typography variant="caption" color="text.secondary">{rev.reviewer?.email}</Typography>
                              </TableCell>
                              <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                <Typography fontWeight="bold">{rev.reviewee?.name || "Deleted User"}</Typography>
                                <Typography variant="caption" color="text.secondary">{rev.reviewee?.email}</Typography>
                              </TableCell>
                              <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                <Rating value={rev.rating || 0} readOnly size="small" />
                              </TableCell>
                              <TableCell sx={{ maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                "{rev.review || "No comments"}"
                              </TableCell>
                              <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{new Date(rev.createdAt).toLocaleDateString()}</TableCell>
                              <TableCell align="center" sx={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                <IconButton color="error" onClick={() => handleDeleteReview(rev._id)}>
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}

                {/* Tab 3: Complaints Manager */}
                {tabValue === 3 && (
                  <TableContainer sx={{ maxHeight: "65vh" }}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold", bgcolor: "rgba(10, 15, 30, 0.85)", color: "primary.main", borderBottom: "1px solid rgba(6, 182, 212, 0.3)" }}>Reporter</TableCell>
                          <TableCell sx={{ fontWeight: "bold", bgcolor: "rgba(10, 15, 30, 0.85)", color: "primary.main", borderBottom: "1px solid rgba(6, 182, 212, 0.3)" }}>Category</TableCell>
                          <TableCell sx={{ fontWeight: "bold", bgcolor: "rgba(10, 15, 30, 0.85)", color: "primary.main", borderBottom: "1px solid rgba(6, 182, 212, 0.3)" }}>Title</TableCell>
                          <TableCell sx={{ fontWeight: "bold", bgcolor: "rgba(10, 15, 30, 0.85)", color: "primary.main", borderBottom: "1px solid rgba(6, 182, 212, 0.3)" }}>Description</TableCell>
                          <TableCell sx={{ fontWeight: "bold", bgcolor: "rgba(10, 15, 30, 0.85)", color: "primary.main", borderBottom: "1px solid rgba(6, 182, 212, 0.3)" }}>Status</TableCell>
                          <TableCell sx={{ fontWeight: "bold", bgcolor: "rgba(10, 15, 30, 0.85)", color: "primary.main", borderBottom: "1px solid rgba(6, 182, 212, 0.3)" }}>Reported User</TableCell>
                          <TableCell sx={{ fontWeight: "bold", bgcolor: "rgba(10, 15, 30, 0.85)", color: "primary.main", borderBottom: "1px solid rgba(6, 182, 212, 0.3)" }}>Date</TableCell>
                          <TableCell sx={{ fontWeight: "bold", bgcolor: "rgba(10, 15, 30, 0.85)", color: "primary.main", borderBottom: "1px solid rgba(6, 182, 212, 0.3)" }} align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {complaints.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} align="center" sx={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>No complaints registered.</TableCell>
                          </TableRow>
                        ) : (
                          complaints.map((comp) => (
                            <TableRow key={comp._id} sx={{ "&:hover": { bgcolor: "rgba(6, 182, 212, 0.04)" } }}>
                              <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                <Typography fontWeight="bold">{comp.user?.name || "Unknown"}</Typography>
                                <Typography variant="caption" color="text.secondary">{comp.user?.email}</Typography>
                              </TableCell>
                              <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                <Chip label={comp.category} size="small" variant="outlined" color="primary" />
                              </TableCell>
                              <TableCell sx={{ fontWeight: "bold", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{comp.title}</TableCell>
                              <TableCell sx={{ maxWidth: 200, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{comp.description}</TableCell>
                              <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                <Chip
                                  label={comp.status}
                                  color={comp.status === "resolved" ? "success" : "warning"}
                                  size="small"
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                {comp.targetUser ? (
                                  <>
                                    <Typography fontWeight="bold">{comp.targetUser.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">{comp.targetUser.email}</Typography>
                                  </>
                                ) : (
                                  <Typography variant="caption" color="text.secondary">N/A</Typography>
                                )}
                              </TableCell>
                              <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{new Date(comp.createdAt).toLocaleDateString()}</TableCell>
                              <TableCell align="center" sx={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                <Stack direction="row" spacing={1} justifyContent="center">
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    color={comp.status === "resolved" ? "warning" : "success"}
                                    startIcon={comp.status === "resolved" ? <RotateLeftIcon /> : <CheckCircleIcon />}
                                    onClick={() => handleToggleComplaintStatus(comp._id)}
                                    sx={{ borderRadius: 2 }}
                                  >
                                    {comp.status === "resolved" ? "Reopen" : "Resolve"}
                                  </Button>
                                  <IconButton color="error" onClick={() => handleDeleteComplaint(comp._id)}>
                                    <DeleteIcon />
                                  </IconButton>
                                </Stack>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}

                {/* Tab 4: Shared Videos moderation */}
                {tabValue === 4 && (
                  <TableContainer sx={{ maxHeight: "65vh" }}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold", bgcolor: "rgba(10, 15, 30, 0.85)", color: "primary.main", borderBottom: "1px solid rgba(6, 182, 212, 0.3)" }}>Video Title</TableCell>
                          <TableCell sx={{ fontWeight: "bold", bgcolor: "rgba(10, 15, 30, 0.85)", color: "primary.main", borderBottom: "1px solid rgba(6, 182, 212, 0.3)" }}>Uploader</TableCell>
                          <TableCell sx={{ fontWeight: "bold", bgcolor: "rgba(10, 15, 30, 0.85)", color: "primary.main", borderBottom: "1px solid rgba(6, 182, 212, 0.3)" }}>Likes</TableCell>
                          <TableCell sx={{ fontWeight: "bold", bgcolor: "rgba(10, 15, 30, 0.85)", color: "primary.main", borderBottom: "1px solid rgba(6, 182, 212, 0.3)" }}>Uploaded At</TableCell>
                          <TableCell sx={{ fontWeight: "bold", bgcolor: "rgba(10, 15, 30, 0.85)", color: "primary.main", borderBottom: "1px solid rgba(6, 182, 212, 0.3)" }} align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {videos.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} align="center" sx={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>No shared videos uploaded.</TableCell>
                          </TableRow>
                        ) : (
                          videos.map((vid) => (
                            <TableRow key={vid._id} sx={{ "&:hover": { bgcolor: "rgba(6, 182, 212, 0.04)" } }}>
                              <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                <Typography fontWeight="bold">{vid.title}</Typography>
                                <Typography variant="caption" color="text.secondary" noWrap maxWidth={250} display="block">
                                  {vid.description || "No description"}
                                </Typography>
                              </TableCell>
                              <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{vid.user?.name || "Unknown User"}</TableCell>
                              <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{vid.likes?.length || 0} Likes</TableCell>
                              <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{new Date(vid.createdAt).toLocaleDateString()}</TableCell>
                              <TableCell align="center" sx={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                <IconButton onClick={() => handleDeleteVideo(vid._id)} color="error" title="Moderate (Delete)">
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Paper>
            </>
          )}
        </Container>
      </Box>
    </>
  );
}

export default AdminDashboard;
