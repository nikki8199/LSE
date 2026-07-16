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
  Tabs,
  Tab,
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
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardNavbar from "../Components/DashboardNavbar/DashboardNavbar";
import Sidebar from "../Components/SideBar/SideBar";

function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);

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

      // Load complaints list
      const complaintsRes = await axios.get("http://localhost:5000/complaints/admin", config);
      setComplaints(complaintsRes.data.complaints || []);

      // Load all videos
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
      <Box sx={{ display: "flex", bgcolor: "transparent", minHeight: "100vh", pt: 10 }}>
        <Sidebar />

        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Stack direction="row" spacing={2} alignItems="center" mb={4}>
            <SupervisedUserCircleIcon color="primary" sx={{ fontSize: 40 }} />
            <Typography variant="h4" fontWeight="bold">
              Admin Monitoring Console
            </Typography>
          </Stack>

          {loading ? (
            <Box display="flex" justifyContent="center" py={5}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Analytics summary widgets */}
              <Grid container spacing={3} mb={4}>
                <Grid item xs={12} sm={6} md={2.4}>
                  <Card sx={{ display: "flex", alignItems: "center", p: 2.5, borderRadius: 4, boxShadow: 3 }}>
                    <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}><SupervisedUserCircleIcon /></Avatar>
                    <Box>
                      <Typography color="text.secondary" variant="caption">Total Members</Typography>
                      <Typography variant="h5" fontWeight="bold">{stats?.totalUsers}</Typography>
                    </Box>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                  <Card sx={{ display: "flex", alignItems: "center", p: 2.5, borderRadius: 4, boxShadow: 3 }}>
                    <Avatar sx={{ bgcolor: "success.main", mr: 2 }}><HandshakeIcon /></Avatar>
                    <Box>
                      <Typography color="text.secondary" variant="caption">Skill Exchanges</Typography>
                      <Typography variant="h5" fontWeight="bold">{stats?.totalRequests}</Typography>
                    </Box>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                  <Card sx={{ display: "flex", alignItems: "center", p: 2.5, borderRadius: 4, boxShadow: 3 }}>
                    <Avatar sx={{ bgcolor: "warning.main", mr: 2 }}><PlayCircleOutlinedIcon /></Avatar>
                    <Box>
                      <Typography color="text.secondary" variant="caption">Shared Videos</Typography>
                      <Typography variant="h5" fontWeight="bold">{stats?.totalVideos}</Typography>
                    </Box>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                  <Card sx={{ display: "flex", alignItems: "center", p: 2.5, borderRadius: 4, boxShadow: 3 }}>
                    <Avatar sx={{ bgcolor: "info.main", mr: 2 }}><StarRateIcon /></Avatar>
                    <Box>
                      <Typography color="text.secondary" variant="caption">Total Reviews</Typography>
                      <Typography variant="h5" fontWeight="bold">{stats?.totalReviews}</Typography>
                    </Box>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                  <Card sx={{ display: "flex", alignItems: "center", p: 2.5, borderRadius: 4, boxShadow: 3 }}>
                    <Avatar sx={{ bgcolor: "error.main", mr: 2 }}><ReportIcon /></Avatar>
                    <Box>
                      <Typography color="text.secondary" variant="caption">Active Complaints</Typography>
                      <Typography variant="h5" fontWeight="bold" color="error.main">
                        {complaints.filter(c => c.status === "pending").length}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              </Grid>

              {/* Management Tabs */}
              <Paper elevation={3} sx={{ borderRadius: 4, overflow: "hidden", mb: 4 }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)} variant="scrollable">
                    <Tab label="Analytics Dashboard" />
                    <Tab label="Users Directory" />
                    <Tab label="User Reviews" />
                    <Tab label="Complaints Desk" />
                    <Tab label="Shared Videos" />
                  </Tabs>
                </Box>

                {/* Tab 0: Analytics & Visual Metrics */}
                {tabValue === 0 && (
                  <Box p={4}>
                    <Grid container spacing={4}>
                      {/* Registration Timeline Chart */}
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" fontWeight="bold" mb={3}>
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
                                  <Typography variant="caption" fontWeight="bold" color="primary.main">{item.count}</Typography>
                                  <Box sx={{
                                    width: "100%",
                                    height: `${pct * 1.5}px`,
                                    maxHeight: "150px",
                                    bgcolor: "primary.main",
                                    borderRadius: "4px 4px 0 0",
                                    transition: "height 0.5s ease"
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
                        <Typography variant="h6" fontWeight="bold" mb={3}>
                          Exchanges Status Breakdown
                        </Typography>
                        <Stack spacing={2}>
                          {["Pending", "Accepted", "Completed", "Rejected"].map(status => {
                            const match = stats?.exchangesByStatus?.find(e => e._id === status);
                            const count = match ? match.count : 0;
                            const total = stats?.totalRequests || 1;
                            const pct = (count / total) * 100;
                            
                            const colorMap = {
                              Pending: "warning.main",
                              Accepted: "info.main",
                              Completed: "success.main",
                              Rejected: "error.main"
                            };

                            return (
                              <Box key={status}>
                                <Stack direction="row" justifyContent="space-between" mb={0.5}>
                                  <Typography variant="body2" fontWeight="bold">{status}</Typography>
                                  <Typography variant="body2" color="text.secondary">{count} ({Math.round(pct)}%)</Typography>
                                </Stack>
                                <Box sx={{ width: "100%", height: 8, bgcolor: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
                                  <Box sx={{ width: `${pct}%`, height: "100%", bgcolor: colorMap[status], borderRadius: 4 }} />
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
                  <TableContainer>
                    <Table>
                      <TableHead sx={{ bgcolor: "rgba(255, 255, 255, 0.03)" }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Verified</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Joined</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }} align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users.map((item) => (
                          <TableRow key={item._id} hover>
                            <TableCell>
                              <Stack direction="row" spacing={1.5} alignItems="center">
                                <Avatar src={item.profileImage} sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
                                  {item.name?.charAt(0)}
                                </Avatar>
                                <Typography fontWeight="bold">{item.name}</Typography>
                              </Stack>
                            </TableCell>
                            <TableCell>{item.email}</TableCell>
                            <TableCell>
                              <Chip
                                label={item.isVerified ? "Verified" : "Pending"}
                                color={item.isVerified ? "success" : "default"}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={item.isActive ? "Active" : "Suspended"}
                                color={item.isActive ? "success" : "error"}
                                size="small"
                              />
                            </TableCell>
                            <TableCell sx={{ textTransform: "capitalize" }}>{item.role}</TableCell>
                            <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell align="center">
                              {item.role !== "admin" ? (
                                <Button
                                  variant="outlined"
                                  size="small"
                                  color={item.isActive ? "error" : "success"}
                                  startIcon={item.isActive ? <LockIcon /> : <LockOpenIcon />}
                                  onClick={() => handleToggleUserStatus(item._id)}
                                >
                                  {item.isActive ? "Suspend" : "Activate"}
                                </Button>
                              ) : (
                                <Typography variant="caption" color="text.secondary">Root Admin</Typography>
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
                  <TableContainer>
                    <Table>
                      <TableHead sx={{ bgcolor: "rgba(255, 255, 255, 0.03)" }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>Reviewer</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Reviewee</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Rating</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Review Text</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }} align="center">Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {reviews.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} align="center">No reviews found.</TableCell>
                          </TableRow>
                        ) : (
                          reviews.map((rev) => (
                            <TableRow key={rev._id} hover>
                              <TableCell>
                                <Typography fontWeight="bold">{rev.reviewer?.name || "Deleted User"}</Typography>
                                <Typography variant="caption" color="text.secondary">{rev.reviewer?.email}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography fontWeight="bold">{rev.reviewee?.name || "Deleted User"}</Typography>
                                <Typography variant="caption" color="text.secondary">{rev.reviewee?.email}</Typography>
                              </TableCell>
                              <TableCell>
                                <Rating value={rev.rating || 0} readOnly size="small" />
                              </TableCell>
                              <TableCell sx={{ maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis" }}>
                                "{rev.review || "No comments"}"
                              </TableCell>
                              <TableCell>{new Date(rev.createdAt).toLocaleDateString()}</TableCell>
                              <TableCell align="center">
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
                  <TableContainer>
                    <Table>
                      <TableHead sx={{ bgcolor: "rgba(255, 255, 255, 0.03)" }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>Reporter</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Reported User</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }} align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {complaints.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} align="center">No complaints registered.</TableCell>
                          </TableRow>
                        ) : (
                          complaints.map((comp) => (
                            <TableRow key={comp._id} hover>
                              <TableCell>
                                <Typography fontWeight="bold">{comp.user?.name || "Unknown"}</Typography>
                                <Typography variant="caption" color="text.secondary">{comp.user?.email}</Typography>
                              </TableCell>
                              <TableCell>
                                <Chip label={comp.category} size="small" variant="outlined" color="primary" />
                              </TableCell>
                              <TableCell fontWeight="bold">{comp.title}</TableCell>
                              <TableCell sx={{ maxWidth: 200 }}>{comp.description}</TableCell>
                              <TableCell>
                                <Chip
                                  label={comp.status}
                                  color={comp.status === "resolved" ? "success" : "warning"}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                {comp.targetUser ? (
                                  <>
                                    <Typography fontWeight="bold">{comp.targetUser.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">{comp.targetUser.email}</Typography>
                                  </>
                                ) : (
                                  <Typography variant="caption" color="text.secondary">N/A</Typography>
                                )}
                              </TableCell>
                              <TableCell>{new Date(comp.createdAt).toLocaleDateString()}</TableCell>
                              <TableCell align="center">
                                <Stack direction="row" spacing={1} justifyContent="center">
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    color={comp.status === "resolved" ? "warning" : "success"}
                                    startIcon={comp.status === "resolved" ? <RotateLeftIcon /> : <CheckCircleIcon />}
                                    onClick={() => handleToggleComplaintStatus(comp._id)}
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
                  <TableContainer>
                    <Table>
                      <TableHead sx={{ bgcolor: "rgba(255, 255, 255, 0.03)" }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>Video Title</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Uploader</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Likes</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Uploaded At</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }} align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {videos.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} align="center">No shared videos uploaded.</TableCell>
                          </TableRow>
                        ) : (
                          videos.map((vid) => (
                            <TableRow key={vid._id} hover>
                              <TableCell>
                                <Typography fontWeight="bold">{vid.title}</Typography>
                                <Typography variant="caption" color="text.secondary" noWrap maxWidth={250} display="block">
                                  {vid.description || "No description"}
                                </Typography>
                              </TableCell>
                              <TableCell>{vid.user?.name || "Unknown User"}</TableCell>
                              <TableCell>{vid.likes?.length || 0} Likes</TableCell>
                              <TableCell>{new Date(vid.createdAt).toLocaleDateString()}</TableCell>
                              <TableCell align="center">
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
