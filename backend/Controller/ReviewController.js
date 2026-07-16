const Review = require("../Model/ReviewModel");
const ExchangeRequest = require("../Model/ExchangeRequestModel");
const User = require("../Model/UserModel");

// ======================================
// Add Review
// ======================================

async function addReview(req, res) {
  try {
    const reviewer = req.userId;
    const exchangeId = req.params.exchangeId;

    const { rating, review } = req.body;

    if (!rating) {
      return res.status(400).json({
        success: false,
        message: "Rating is required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const exchange = await ExchangeRequest.findById(exchangeId);

    if (!exchange) {
      return res.status(404).json({
        success: false,
        message: "Exchange not found",
      });
    }

    if (exchange.status !== "Completed") {
      return res.status(400).json({
        success: false,
        message: "Exchange is not completed yet",
      });
    }

    if (
      exchange.sender.toString() !== reviewer &&
      exchange.receiver.toString() !== reviewer
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const reviewee =
      exchange.sender.toString() === reviewer
        ? exchange.receiver
        : exchange.sender;

    const alreadyReviewed = await Review.findOne({
      exchange: exchangeId,
      reviewer,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this exchange",
      });
    }

    const newReview = await Review.create({
      exchange: exchangeId,
      reviewer,
      reviewee,
      rating,
      review,
    });

    return res.status(201).json({
      success: true,
      message: "Review added successfully",
      review: newReview,
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
}

// ======================================
// Get Reviews of a User
// ======================================

async function getUserReviews(req, res) {
  try {

    const userId = req.params.id;

    const reviews = await Review.find({
      reviewee: userId,
    })
      .populate("reviewer", "name profileImage")
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;

    let averageRating = 0;

    if (totalReviews > 0) {
      const totalRating = reviews.reduce(
        (sum, item) => sum + item.rating,
        0
      );

      averageRating = Number(
        (totalRating / totalReviews).toFixed(1)
      );
    }

    return res.status(200).json({
      success: true,
      totalReviews,
      averageRating,
      reviews,
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
}

// ======================================
// Delete Review
// ======================================

async function deleteReview(req, res) {
  try {

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.reviewer.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
}

// ======================================
// ADMIN: Get All Reviews
// ======================================
async function getAllReviewsAdmin(req, res) {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Admin access only",
      });
    }

    const reviews = await Review.find()
      .populate("reviewer", "name email profileImage")
      .populate("reviewee", "name email profileImage")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

// ======================================
// ADMIN: Delete Any Review
// ======================================
async function deleteReviewAdmin(req, res) {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Admin access only",
      });
    }

    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review moderated and deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = {
  addReview,
  getUserReviews,
  deleteReview,
  getAllReviewsAdmin,
  deleteReviewAdmin,
};