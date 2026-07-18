const upload = require("../MiddleWare/upload");

const express = require("express");

const router = express.Router();



const isUser = require("../MiddleWare/isUser");
const {
  exploreUsers,
  searchUsers,
  getUserProfile,
  updateProfile,
  myProfile,
  uploadProfileImage,
  getSimilarUsers,
  getUserStats,
  getAllUsersAdmin,
  toggleUserStatusAdmin,
  getAdminStats,
} = require("../Controller/UserController");

// Explore Users
router.get("/explore", isUser, exploreUsers);

// Search Users
router.get("/search", isUser, searchUsers);

// Admin Routes
router.get("/admin/users", isUser, getAllUsersAdmin);
router.patch("/admin/users/toggle/:id", isUser, toggleUserStatusAdmin);
router.get("/admin/stats", isUser, getAdminStats);

// User Stats
router.get("/profile/:id/stats", isUser, getUserStats);

// User Profile
router.get("/profile/:id", isUser, getUserProfile);

// Update Profile
router.patch("/update", isUser, updateProfile);

// My Profile
router.get("/my-profile", isUser, myProfile);

router.patch(
  "/upload-profile",
  isUser,
  upload.single("profileImage"),
  uploadProfileImage
);
router.get("/similar/:id", isUser, getSimilarUsers);

router.get("/stats/:id", isUser, getUserStats);


module.exports = router;