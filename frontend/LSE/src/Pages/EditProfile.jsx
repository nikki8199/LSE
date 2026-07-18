import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Chip,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Stack,
  Alert,
  Avatar,
  IconButton,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { updateProfile, uploadProfileImage } from "../Services/userService";
import DashboardNavbar from "../Components/DashboardNavbar/DashboardNavbar";
import Sidebar from "../Components/SideBar/SideBar";

function EditProfile() {
  const navigate = useNavigate();
  const { user, token, login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    city: "",
    state: "",
    country: "India",
    experience: "Beginner",
    availability: "Anytime",
    currentOfferSkill: "",
    currentNeedSkill: "",
  });

  const [skillsOffered, setSkillsOffered] = useState([]);
  const [skillsNeeded, setSkillsNeeded] = useState([]);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "India",
        experience: user.experience || "Beginner",
        availability: user.availability || "Anytime",
        currentOfferSkill: "",
        currentNeedSkill: "",
      });
      setSkillsOffered(user.skillsOffered || []);
      setSkillsNeeded(user.skillsNeeded || []);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddOfferedSkill = () => {
    const val = formData.currentOfferSkill.trim();
    if (val && !skillsOffered.includes(val)) {
      setSkillsOffered([...skillsOffered, val]);
      setFormData({ ...formData, currentOfferSkill: "" });
    }
  };

  const handleAddNeededSkill = () => {
    const val = formData.currentNeedSkill.trim();
    if (val && !skillsNeeded.includes(val)) {
      setSkillsNeeded([...skillsNeeded, val]);
      setFormData({ ...formData, currentNeedSkill: "" });
    }
  };

  const handleDeleteOffered = (skill) => {
    setSkillsOffered(skillsOffered.filter((s) => s !== skill));
  };

  const handleDeleteNeeded = (skill) => {
    setSkillsNeeded(skillsNeeded.filter((s) => s !== skill));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setStatus({ type: "error", message: "Image file size should be less than 5MB." });
      return;
    }

    try {
      setLoading(true);
      setStatus({ type: "", message: "" });
      
      const uploadData = new FormData();
      uploadData.append("profileImage", file);

      const res = await uploadProfileImage(uploadData);
      
      // Update auth context
      login(token, res.user);
      setStatus({ type: "success", message: "Profile picture uploaded successfully!" });
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Failed to upload profile picture.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (skillsOffered.length === 0) {
      setStatus({ type: "error", message: "Please add at least one skill you can offer." });
      return;
    }
    if (skillsNeeded.length === 0) {
      setStatus({ type: "error", message: "Please add at least one skill you want to learn." });
      return;
    }

    try {
      setLoading(true);
      setStatus({ type: "", message: "" });

      const body = {
        name: formData.name,
        bio: formData.bio,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        experience: formData.experience,
        availability: formData.availability,
        skillsOffered,
        skillsNeeded,
      };

      const data = await updateProfile(body);
      login(token, data.user);
      setStatus({ type: "success", message: "Profile updated successfully!" });
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DashboardNavbar />
      <Box sx={{ display: "flex", bgcolor: "transparent", minHeight: "100vh", pt: 8 }}>
        <Sidebar />

        <Container maxWidth="md" sx={{ py: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ mb: 3 }}
          >
            Back
          </Button>

          <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
            <Typography variant="h5" fontWeight="bold" mb={3}>
              Edit Your Profile
            </Typography>

            {status.message && (
              <Alert severity={status.type} sx={{ mb: 3 }}>
                {status.message}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
                <Box sx={{ position: "relative", width: 100, height: 100 }}>
                  <Avatar
                    src={user?.profileImage}
                    sx={{
                      width: 100,
                      height: 100,
                      border: "2px solid rgba(255, 255, 255, 0.2)",
                      boxShadow: 3,
                    }}
                  >
                    {user?.name?.charAt(0)}
                  </Avatar>
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="profile-upload-button"
                    type="file"
                    onChange={handlePhotoUpload}
                  />
                  <label htmlFor="profile-upload-button">
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="span"
                      disabled={loading}
                      sx={{
                        position: "absolute",
                        bottom: -5,
                        right: -5,
                        bgcolor: "background.paper",
                        boxShadow: 2,
                        "&:hover": { bgcolor: "primary.light", color: "white" },
                      }}
                    >
                      <PhotoCameraIcon />
                    </IconButton>
                  </label>
                </Box>
                <Typography variant="caption" sx={{ mt: 1.5, color: "text.secondary" }}>
                  Allowed formats: JPG, PNG. Max size: 5MB
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Bio / About Yourself"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Experience Level</InputLabel>
                    <Select
                      name="experience"
                      value={formData.experience}
                      label="Experience Level"
                      onChange={handleChange}
                    >
                      <MenuItem value="Beginner">Beginner</MenuItem>
                      <MenuItem value="Intermediate">Intermediate</MenuItem>
                      <MenuItem value="Advanced">Advanced</MenuItem>
                      <MenuItem value="Expert">Expert</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Availability</InputLabel>
                    <Select
                      name="availability"
                      value={formData.availability}
                      label="Availability"
                      onChange={handleChange}
                    >
                      <MenuItem value="Weekdays">Weekdays</MenuItem>
                      <MenuItem value="Weekends">Weekends</MenuItem>
                      <MenuItem value="Evenings">Evenings</MenuItem>
                      <MenuItem value="Anytime">Anytime</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Skills Offered */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                    Skills You Can Offer (Teach)
                  </Typography>
                  <Stack direction="row" spacing={1} mb={2}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Add a skill you teach"
                      name="currentOfferSkill"
                      value={formData.currentOfferSkill}
                      onChange={handleChange}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddOfferedSkill();
                        }
                      }}
                    />
                    <Button variant="contained" onClick={handleAddOfferedSkill}>
                      Add
                    </Button>
                  </Stack>
                  <Box>
                    {skillsOffered.map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        color="primary"
                        onDelete={() => handleDeleteOffered(skill)}
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                </Grid>

                {/* Skills Needed */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                    Skills You Want to Learn
                  </Typography>
                  <Stack direction="row" spacing={1} mb={2}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Add a skill you want to learn"
                      name="currentNeedSkill"
                      value={formData.currentNeedSkill}
                      onChange={handleChange}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddNeededSkill();
                        }
                      }}
                    />
                    <Button variant="contained" color="secondary" onClick={handleAddNeededSkill}>
                      Add
                    </Button>
                  </Stack>
                  <Box>
                    {skillsNeeded.map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        color="secondary"
                        onDelete={() => handleDeleteNeeded(skill)}
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={<SaveIcon />}
                    disabled={loading}
                    sx={{ py: 1.5, borderRadius: 3, fontWeight: "bold" }}
                  >
                    {loading ? "Saving Changes..." : "Save Changes"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      </Box>
    </>
  );
}

export default EditProfile;
