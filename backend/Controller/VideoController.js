const Video = require("../Model/VideoModel");
const fs = require("fs");
const path = require("path");

// ======================================
// Upload Video
// ======================================
async function uploadVideo(req, res) {
  try {
    const { title, description } = req.body;
    const userId = req.userId;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a video file",
      });
    }

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    // Standardize URL to serve statically
    const videoUrl = `/Uploads/videos/${req.file.filename}`;

    const video = await Video.create({
      user: userId,
      title,
      description,
      videoUrl,
    });

    const populatedVideo = await Video.findById(video._id).populate(
      "user",
      "name email profileImage role"
    );

    return res.status(201).json({
      success: true,
      message: "Video shared successfully!",
      video: populatedVideo,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

// ======================================
// Get Videos Feed
// ======================================
async function getVideos(req, res) {
  try {
    const videos = await Video.find()
      .populate("user", "name email profileImage role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: videos.length,
      videos,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

// ======================================
// Toggle Like Video
// ======================================
async function toggleLikeVideo(req, res) {
  try {
    const videoId = req.params.id;
    const userId = req.userId;

    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const likeIndex = video.likes.indexOf(userId);

    if (likeIndex === -1) {
      // Like the video
      video.likes.push(userId);
    } else {
      // Unlike the video
      video.likes.splice(likeIndex, 1);
    }

    await video.save();

    return res.status(200).json({
      success: true,
      likes: video.likes,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

// ======================================
// Delete Video
// ======================================
async function deleteVideo(req, res) {
  try {
    const videoId = req.params.id;
    const userId = req.userId;
    const role = req.role;

    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    // Only owner or admin can delete
    if (video.user.toString() !== userId && role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this video",
      });
    }

    // Remove file from disk
    const relativePath = video.videoUrl.substring(1); // removes leading '/'
    const fullPath = path.join(__dirname, "../..", relativePath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    await Video.findByIdAndDelete(videoId);

    return res.status(200).json({
      success: true,
      message: "Video deleted successfully!",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = {
  uploadVideo,
  getVideos,
  toggleLikeVideo,
  deleteVideo,
};
