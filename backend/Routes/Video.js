const express = require("express");
const router = express.Router();

const isUser = require("../Middleware/isUser");
const uploadVideo = require("../MiddleWare/uploadVideo");
const {
  uploadVideo: uploadVideoController,
  getVideos,
  toggleLikeVideo,
  deleteVideo,
} = require("../Controller/VideoController");

// Get all shared videos
router.get("/", isUser, getVideos);

// Upload a new video
router.post(
  "/upload",
  isUser,
  uploadVideo.single("video"),
  uploadVideoController
);

// Toggle video like
router.post("/like/:id", isUser, toggleLikeVideo);

// Delete a video
router.delete("/:id", isUser, deleteVideo);

module.exports = router;
