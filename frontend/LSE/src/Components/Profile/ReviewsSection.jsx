import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Rating,
  Stack,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import StarRateIcon from "@mui/icons-material/StarRate";
import axios from "axios";

function ReviewsSection({ userId }) {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchReviews();
    }
  }, [userId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const res = await axios.get(`http://localhost:5000/review/user/${userId}`, config);
      setReviews(res.data.reviews || []);
      setAverageRating(res.data.averageRating || 0);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress size={30} />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 5 }}>
      <Stack direction="row" spacing={2} alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>
          Community Reviews
        </Typography>
        {reviews.length > 0 && (
          <Box display="flex" alignItems="center" gap={0.5} sx={{ bgcolor: "rgba(255,255,255,0.06)", py: 0.5, px: 1.5, borderRadius: 3 }}>
            <StarRateIcon color="warning" sx={{ fontSize: 18 }} />
            <Typography variant="body2" fontWeight="bold">
              {averageRating} ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
            </Typography>
          </Box>
        )}
      </Stack>

      {reviews.length === 0 ? (
        <Paper
          elevation={1}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 3,
            bgcolor: "rgba(255, 255, 255, 0.02)",
            border: "1px dashed rgba(255, 255, 255, 0.08)",
          }}
        >
          <Typography color="text.secondary" variant="body2">
            No reviews yet for this community member.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {reviews.map((review) => (
            <Grid item xs={12} md={6} lg={4} key={review._id}>
              <Card
                elevation={3}
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  bgcolor: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  transition: "all .3s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: 8,
                    borderColor: "primary.main",
                  },
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      src={review.reviewer?.profileImage}
                      sx={{
                        width: 48,
                        height: 48,
                        fontWeight: 700,
                        bgcolor: "primary.main",
                      }}
                    >
                      {review.reviewer?.name?.charAt(0)}
                    </Avatar>

                    <Box>
                      <Typography fontWeight={600} variant="subtitle2">
                        {review.reviewer?.name || "Deleted User"}
                      </Typography>

                      <Rating
                        value={review.rating}
                        precision={0.5}
                        readOnly
                        size="small"
                        sx={{ my: 0.5 }}
                      />

                      <Typography variant="caption" color="text.secondary" display="block">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 1.5, borderColor: "rgba(255,255,255,0.06)" }} />

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.6,
                      fontStyle: "italic",
                    }}
                  >
                    "{review.review || "No comments written"}"
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

import { Paper } from "@mui/material"; // Import Paper explicitly at the end or top

export default ReviewsSection;