
const express = require("express");

const router = express.Router();

const isUser = require("../MiddleWare/isUser");

const {
  addReview,
  getUserReviews,
  deleteReview,
  getAllReviewsAdmin,
  deleteReviewAdmin,
} = require("../Controller/ReviewController");


router.post("/add/:exchangeId", isUser, addReview);

router.get("/user/:id", isUser, getUserReviews);

router.delete("/:id", isUser, deleteReview);

// Admin Routes
router.get("/admin", isUser, getAllReviewsAdmin);
router.delete("/admin/:id", isUser, deleteReviewAdmin);

module.exports = router;