import React from "react";
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
  Button,
} from "@mui/material";

const reviews = [
  {
    id: 1,
    name: "John David",
    rating: 5,
    comment:
      "Very patient teacher. Explained React concepts clearly and made learning enjoyable.",
    date: "July 2026",
  },
  {
    id: 2,
    name: "Rahul Sharma",
    rating: 5,
    comment:
      "Excellent mentor for Node.js. Every session was practical and easy to understand.",
    date: "June 2026",
  },
  {
    id: 3,
    name: "Sophia Wilson",
    rating: 4,
    comment:
      "Friendly and supportive throughout the exchange. Looking forward to another session.",
    date: "June 2026",
  },
];

function ReviewsSection() {
  return (
    <Box sx={{ mt: 5 }}>
      <Typography
        variant="h5"
        fontWeight={700}
        sx={{ mb: 3 }}
      >
        Community Reviews
      </Typography>

      <Grid container spacing={3}>
        {reviews.map((review) => (
          <Grid
            item
            xs={12}
            md={6}
            lg={4}
            key={review.id}
          >
            <Card
              elevation={3}
              sx={{
                height: "100%",
                borderRadius: 3,
                transition: "all .3s ease",

                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: 8,
                },
              }}
            >
              <CardContent>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                >
                  <Avatar
                    sx={{
                      width: 55,
                      height: 55,
                      fontWeight: 700,
                    }}
                  >
                    {review.name.charAt(0)}
                  </Avatar>

                  <Box>
                    <Typography
                      fontWeight={600}
                      variant="subtitle1"
                    >
                      {review.name}
                    </Typography>

                    <Rating
                      value={review.rating}
                      precision={0.5}
                      readOnly
                      size="small"
                    />

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {review.date}
                    </Typography>
                  </Box>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.8,
                  }}
                >
                  "{review.comment}"
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 4,
        }}
      >
        <Button
          variant="outlined"
          sx={{
            px: 4,
            py: 1,
            borderRadius: "30px",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          View All Reviews
        </Button>
      </Box>
    </Box>
  );
}

export default ReviewsSection;