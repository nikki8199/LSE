import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Stack,
  Alert,
} from "@mui/material";
import ReportIcon from "@mui/icons-material/Report";
import axios from "axios";

function ComplaintModal({ open, onClose, onSubmitSuccess, initialTargetEmail }) {
  const [formData, setFormData] = useState({
    title: "",
    category: "Other",
    targetUserEmail: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setFormData({
        title: "",
        category: initialTargetEmail ? "User Behavior" : "Other",
        targetUserEmail: initialTargetEmail || "",
        description: "",
      });
      setError("");
    }
  }, [open, initialTargetEmail]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      setError("Please fill in the title and description.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      let targetUserId = null;

      // If user provided a target user's email, check if user exists
      if (formData.targetUserEmail.trim()) {
        try {
          const searchRes = await axios.get(
            `http://localhost:5000/users/search?search=${encodeURIComponent(
              formData.targetUserEmail.trim()
            )}`,
            config
          );
          const found = searchRes.data.users?.find(
            (u) => u.email.toLowerCase() === formData.targetUserEmail.trim().toLowerCase()
          );
          if (found) {
            targetUserId = found._id;
          } else {
            setError("No member found with that email. Leave blank if not user specific.");
            setLoading(false);
            return;
          }
        } catch (searchErr) {
          console.error("Error finding target user:", searchErr);
        }
      }

      const body = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        targetUserId,
      };

      await axios.post("http://localhost:5000/complaints", body, config);
      alert("Feedback / Complaint registered successfully! Our admin team will investigate.");
      
      setFormData({
        title: "",
        category: "Other",
        targetUserEmail: "",
        description: "",
      });

      if (onSubmitSuccess) onSubmitSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <ReportIcon color="error" />
        <Typography variant="h6" fontWeight="bold">File Feedback or Complaint</Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={3}>
            {error && <Alert severity="error">{error}</Alert>}

            <Typography variant="body2" color="text.secondary">
              Report behavior, share technical issues, or request content moderations. The administration desk reviews every request.
            </Typography>

            <TextField
              required
              fullWidth
              label="Subject / Short Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Broken links on explore page, inappropriate profile information..."
            />

            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                label="Category"
                onChange={handleChange}
              >
                <MenuItem value="User Behavior">User Behavior</MenuItem>
                <MenuItem value="Technical Issue">Technical Issue</MenuItem>
                <MenuItem value="Content Violation">Content Violation</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Reported User Email (Optional)"
              name="targetUserEmail"
              value={formData.targetUserEmail}
              onChange={handleChange}
              disabled={Boolean(initialTargetEmail)}
              placeholder="e.g. user@example.com"
              helperText="Only fill if reporting behavior of another specific member"
            />

            <TextField
              required
              fullWidth
              multiline
              rows={4}
              label="Detailed Explanation"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Please explain the issue or details here..."
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <Button onClick={onClose} color="inherit" disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? "Submitting..." : "Submit File"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default ComplaintModal;
