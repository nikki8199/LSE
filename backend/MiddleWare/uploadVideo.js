const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadPath = "Uploads/videos";

// Create destination directory if not exists
if (!fs.existsSync("Uploads")) {
  fs.mkdirSync("Uploads");
}
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only video files (mp4, webm, ogg, quicktime) are allowed"), false);
  }
};

const uploadVideo = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

module.exports = uploadVideo;
