const express = require("express");
const router = express.Router();
const isUser = require("../MiddleWare/isUser");
const {
  createComplaint,
  getAllComplaintsAdmin,
  toggleComplaintStatusAdmin,
  deleteComplaintAdmin,
} = require("../Controller/ComplaintController");

// Submit Complaint (Normal User)
router.post("/", isUser, createComplaint);

// Admin Complaint Management
router.get("/admin", isUser, getAllComplaintsAdmin);
router.patch("/admin/:id/status", isUser, toggleComplaintStatusAdmin);
router.delete("/admin/:id", isUser, deleteComplaintAdmin);

module.exports = router;
