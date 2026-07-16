import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  CircularProgress,
  Divider,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlayCircleOutlinedIcon from "@mui/icons-material/PlayCircleOutlined";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardNavbar from "../Components/DashboardNavbar/DashboardNavbar";
import Sidebar from "../Components/SideBar/SideBar";
import { getVideos, uploadVideo, toggleLikeVideo, deleteVideo } from "../Services/videoService";

function Videos() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  
  // Upload form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const data = await getVideos();
      setVideos(data.videos || []);
    } catch (err) {
      console.error("Error loading videos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    try {
      const data = await toggleLikeVideo(id);
      setVideos(
        videos.map((vid) =>
          vid._id === id ? { ...vid, likes: data.likes } : vid
        )
      );
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      await deleteVideo(id);
      setVideos(videos.filter((vid) => vid._id !== id));
      alert("Video deleted successfully!");
    } catch (err) {
      alert("Failed to delete video");
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!title || !videoFile) {
      alert("Please enter a title and select a video file.");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("video", videoFile);

      await uploadVideo(formData);
      alert("Video uploaded successfully!");
      setUploadOpen(false);
      setTitle("");
      setDescription("");
      setVideoFile(null);
      loadVideos();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to upload video");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <DashboardNavbar />
      <Box sx={{ display: "flex", bgcolor: "transparent", minHeight: "100vh", pt: 10 }}>
        <Sidebar />

        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{ fontWeight: "bold" }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              startIcon={<CloudUploadIcon />}
              onClick={() => setUploadOpen(true)}
              sx={{ borderRadius: 3, fontWeight: "bold", px: 3, py: 1.2 }}
            >
              Share Video
            </Button>
          </Stack>

          <Typography variant="h4" fontWeight="bold" mb={3}>
            Community Skill Videos
          </Typography>
          <Typography color="text.secondary" mb={4}>
            Check out short videos shared by community members showing off their skills and tutorials.
          </Typography>

          {loading ? (
            <Box display="flex" justifyContent="center" py={5}>
              <CircularProgress />
            </Box>
          ) : videos.length === 0 ? (
            <Paper sx={{ p: 5, textAlign: "center", borderRadius: 4 }}>
              <PlayCircleOutlinedIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No videos shared yet.
              </Typography>
              <Typography color="text.secondary" mb={3}>
                Be the first to share a tutorial or demonstration of your skills!
              </Typography>
              <Button variant="contained" onClick={() => setUploadOpen(true)}>
                Upload Now
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={4}>
              {videos.map((vid) => {
                const isLiked = vid.likes.includes(user?._id);
                const canDelete = vid.user?._id === user?._id || user?.role === "admin";

                return (
                  <Grid item xs={12} sm={6} lg={4} key={vid._id}>
                    <Card sx={{ borderRadius: 4, height: "100%", display: "flex", flexDirection: "column", boxShadow: 3 }}>
                      {/* Video Player */}
                      <Box sx={{ position: "relative", pt: "56.25%", bgcolor: "black", borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                        <video
                          src={`http://localhost:5000${vid.videoUrl}`}
                          controls
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </Box>

                      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", p: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom noWrap>
                          {vid.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ flex: 1, mb: 2 }} className="multiline-ellipsis">
                          {vid.description || "No description provided."}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        {/* Footer details */}
                        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar src={vid.user?.profileImage} sx={{ width: 36, height: 36, bgcolor: "primary.main" }}>
                              {vid.user?.name?.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="bold" noWrap maxWidth={120}>
                                {vid.user?.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(vid.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Stack>

                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <IconButton onClick={() => handleLike(vid._id)} color={isLiked ? "error" : "default"}>
                              {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                            </IconButton>
                            <Typography variant="body2" fontWeight="bold">
                              {vid.likes.length}
                            </Typography>
                            {canDelete && (
                              <IconButton onClick={() => handleDelete(vid._id)} color="error" sx={{ ml: 1 }}>
                                <DeleteIcon />
                              </IconButton>
                            )}
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}

          {/* Upload Video Dialog */}
          <Dialog open={uploadOpen} onClose={() => !uploading && setUploadOpen(false)} fullWidth maxWidth="sm">
            <DialogTitle fontWeight="bold">Share a Skill Video</DialogTitle>
            <form onSubmit={handleUploadSubmit}>
              <DialogContent>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    required
                    label="Video Title"
                    placeholder="e.g. Intro to Portrait Photography"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={uploading}
                  />

                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Description"
                    placeholder="Describe what skill is taught in this video..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={uploading}
                  />

                  {/* Multer Video Picker */}
                  <Box
                    sx={{
                      border: "2px dashed #B0BEC5",
                      borderRadius: 3,
                      p: 4,
                      textAlign: "center",
                      bgcolor: "#ECEFF1",
                      cursor: "pointer",
                      "&:hover": { bgcolor: "#CFD8DC" },
                    }}
                    onClick={() => !uploading && fileInputRef.current.click()}
                  >
                    <CloudUploadIcon sx={{ fontSize: 40, color: "text.secondary", mb: 1 }} />
                    <Typography fontWeight="bold" variant="body2">
                      {videoFile ? videoFile.name : "Click to select MP4/WebM video file"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Max file size: 50MB
                    </Typography>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="video/mp4,video/webm,video/ogg,video/quicktime"
                      style={{ display: "none" }}
                    />
                  </Box>
                </Stack>
              </DialogContent>
              <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={() => setUploadOpen(false)} disabled={uploading}>
                  Cancel
                </Button>
                <Button variant="contained" type="submit" disabled={uploading || !title || !videoFile} startIcon={uploading && <CircularProgress size={20} color="inherit" />}>
                  {uploading ? "Uploading..." : "Share Video"}
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        </Container>
      </Box>
    </>
  );
}

export default Videos;
