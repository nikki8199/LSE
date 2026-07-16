const Complaint = require("../Model/ComplaintModel");
const User = require("../Model/UserModel");

// ======================================
// Create Complaint
// ======================================
async function createComplaint(req, res) {
  try {
    const { title, description, category, targetUserId } = req.body;
    const userId = req.userId;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    const complaintData = {
      user: userId,
      title,
      description,
      category: category || "Other",
      status: "pending",
    };

    if (targetUserId) {
      const targetUserExists = await User.findById(targetUserId);
      if (targetUserExists) {
        complaintData.targetUser = targetUserId;
      }
    }

    const complaint = await Complaint.create(complaintData);

    return res.status(201).json({
      success: true,
      message: "Complaint registered successfully",
      complaint,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

// ======================================
// Get All Complaints (Admin Only)
// ======================================
async function getAllComplaintsAdmin(req, res) {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Admin access only",
      });
    }

    const complaints = await Complaint.find()
      .populate("user", "name email profileImage")
      .populate("targetUser", "name email profileImage")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

// ======================================
// Toggle Status (Admin Only)
// ======================================
async function toggleComplaintStatusAdmin(req, res) {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Admin access only",
      });
    }

    const complaintId = req.params.id;
    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    complaint.status = complaint.status === "pending" ? "resolved" : "pending";
    await complaint.save();

    return res.status(200).json({
      success: true,
      message: `Complaint marked as ${complaint.status}`,
      complaint,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

// ======================================
// Delete Complaint (Admin Only)
// ======================================
async function deleteComplaintAdmin(req, res) {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Admin access only",
      });
    }

    const complaintId = req.params.id;
    const complaint = await Complaint.findByIdAndDelete(complaintId);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Complaint deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = {
  createComplaint,
  getAllComplaintsAdmin,
  toggleComplaintStatusAdmin,
  deleteComplaintAdmin,
};
