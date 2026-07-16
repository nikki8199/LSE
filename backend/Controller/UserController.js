const User = require("../Model/UserModel");
const ExchangeRequest = require("../Model/ExchangeRequestModel");
const Review = require("../Model/ReviewModel");
const Video = require("../Model/VideoModel");
const Complaint = require("../Model/ComplaintModel");


// ===============================
// Explore Users
// ===============================

async function exploreUsers(req, res) {
  try {
    const currentUser = req.userId;

    const users = await User.find({
      _id: { $ne: currentUser },
      isVerified: true,
    })
      .select("-password -ratings")
      .sort({
        rating: -1,
        completedExchanges: -1,
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
}

// ===============================
// Get User Profile
// ===============================

async function getUserProfile(req, res) {
  try {

    const id = req.params.id;

    // Validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid User Id",
      });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
}

// ===============================
// Search Users
// ===============================

async function searchUsers(req, res) {
  try {

    const keyword = req.query.keyword?.trim();

    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: "Search keyword is required",
      });
    }

    const users = await User.find({
      _id: { $ne: req.userId },
      isVerified: true,
      $or: [
        {
          name: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          city: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          state: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          skillsOffered: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          skillsNeeded: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    })
      .select("-password -ratings")
      .sort({
        rating: -1,
        completedExchanges: -1,
      });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
}


// ===============================
// Update Profile
// ===============================

async function updateProfile(req, res) {
  try {

    const userId = req.userId;

    const {
      name,
      bio,
      city,
      state,
      country,
      profileImage,
      skillsOffered,
      skillsNeeded,
      experience,
      availability,
    } = req.body;

    // Build update object dynamically
    const updates = {};

    if (name !== undefined) updates.name = name;
    if (bio !== undefined) updates.bio = bio;
    if (city !== undefined) updates.city = city;
    if (state !== undefined) updates.state = state;
    if (country !== undefined) updates.country = country;
    if (profileImage !== undefined) updates.profileImage = profileImage;
    if (skillsOffered !== undefined) updates.skillsOffered = skillsOffered;
    if (skillsNeeded !== undefined) updates.skillsNeeded = skillsNeeded;
    if (experience !== undefined) updates.experience = experience;
    if (availability !== undefined) updates.availability = availability;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
}

// ===============================
// My Profile
// ===============================

async function myProfile(req, res) {
  try {

    const user = await User.findById(req.userId)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
}

// ===============================
// Upload Profile Image
// ===============================

async function uploadProfileImage(req, res) {
  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image",
      });
    }

    const imagePath = "http://localhost:5000/Uploads/" + req.file.filename;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        profileImage: imagePath,
      },
      {
        new: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      image: imagePath,
      user,
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
}

// ===============================
// Similar Users
// ===============================

async function getSimilarUsers(req, res) {
  try {

    const userId = req.params.id;

    // Validate ObjectId
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid User Id",
      });
    }

    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const similarUsers = await User.find({
      _id: { $ne: userId },
      isVerified: true,
      $or: [
        {
          skillsOffered: {
            $in: currentUser.skillsOffered,
          },
        },
        {
          skillsNeeded: {
            $in: currentUser.skillsNeeded,
          },
        },
        {
          skillsOffered: {
            $in: currentUser.skillsNeeded,
          },
        },
        {
          skillsNeeded: {
            $in: currentUser.skillsOffered,
          },
        },
      ],
    })
      .select("-password -ratings")
      .sort({
        rating: -1,
        completedExchanges: -1,
      })
      .limit(6);

    return res.status(200).json({
      success: true,
      count: similarUsers.length,
      users: similarUsers,
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
}

// ===============================
// User Statistics
// ===============================

async function getUserStats(req, res) {
  try {

    const userId = req.params.id;

    // Validate ObjectId
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid User Id",
      });
    }

    const user = await User.findById(userId).select(
      "rating totalReviews completedExchanges createdAt"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const pendingRequests = await ExchangeRequest.countDocuments({
      receiver: userId,
      status: "Pending",
    });

    const acceptedRequests = await ExchangeRequest.countDocuments({
      receiver: userId,
      status: "Accepted",
    });

    const completedRequests = await ExchangeRequest.countDocuments({
      receiver: userId,
      status: "Completed",
    });

    return res.status(200).json({
      success: true,
      stats: {
        rating: user.rating,
        totalReviews: user.totalReviews,
        completedExchanges: user.completedExchanges,
        pendingRequests,
        acceptedRequests,
        completedRequests,
        joined: user.createdAt,
      },
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
}

// ===============================
// ADMIN: Get All Users
// ===============================
async function getAllUsersAdmin(req, res) {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Admin access only",
      });
    }

    const users = await User.find().select("-password").sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

// ===============================
// ADMIN: Toggle User Status
// ===============================
async function toggleUserStatusAdmin(req, res) {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Admin access only",
      });
    }

    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Toggle active state
    user.isActive = !user.isActive;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User status changed to ${user.isActive ? "Active" : "Inactive"}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

// ===============================
// ADMIN: Get Dashboard Stats
// ===============================
async function getAdminStats(req, res) {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Admin access only",
      });
    }

    const totalUsers = await User.countDocuments();
    const totalRequests = await ExchangeRequest.countDocuments();
    const totalVideos = await Video.countDocuments();
    const totalReviews = await Review.countDocuments();
    const totalComplaints = await Complaint.countDocuments();

    // Registrations timeline (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentRegistrations = await User.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Exchanges grouped by status
    const exchangesByStatus = await ExchangeRequest.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // Complaints grouped by status
    const complaintsByStatus = await Complaint.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalRequests,
        totalVideos,
        totalReviews,
        totalComplaints,
        recentRegistrations,
        exchangesByStatus,
        complaintsByStatus,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = {
  exploreUsers,
  getUserProfile,
  searchUsers,
  updateProfile,
  myProfile,
  uploadProfileImage,
  getSimilarUsers,
  getUserStats,
  getAllUsersAdmin,
  toggleUserStatusAdmin,
  getAdminStats,
};