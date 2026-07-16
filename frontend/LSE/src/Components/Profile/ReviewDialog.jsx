import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Rating,
  Typography,
  Stack,
  Alert,
  Box,
} from "@mui/material";
import StarRateIcon from "@mui/icons-material/StarRate";
import axios from "axios";

function ReviewDialog({ open, onClose, exchangeId, partnerName, onSubmitSuccess }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      setError("Please select a rating.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const body = {
        rating,
        review: comment.trim(),
      };

      await axios.post(`http://localhost:5000/review/add/${exchangeId}`, body, config);
      alert("Review submitted successfully! Thank you for sharing your feedback.");
      
      setRating(5);
      setComment("");
      
      if (onSubmitSuccess) onSubmitSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review. Have you already reviewed this exchange?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <Typography variant="h6" fontWeight="bold">Review {partnerName || "Exchange Partner"}</Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={3} alignItems="center">
            {error && <Alert severity="error" sx={{ width: "100%" }}>{error}</Alert>}

            <Typography variant="body2" color="text.secondary" align="center">
              Please rate your skill exchange experience and leave constructive feedback.
            </Typography>

            <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
              <Typography fontWeight="bold" variant="body1">Rating</Typography>
              <Rating
                value={rating}
                onChange={(event, newValue) => setRating(newValue)}
                size="large"
                emptyIcon={<StarRateIcon style={{ opacity: 0.25 }} fontSize="inherit" />}
              />
            </Box>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Share your feedback"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Explain what you learned, how patient they were, or any suggestions..."
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <Button onClick={onClose} color="inherit" disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="secondary" disabled={loading}>
            {loading ? "Submitting..." : "Submit Review"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default ReviewDialog;
