const ExchangeRequest = require("../Model/ExchangeRequestModel");
const NotificationModel = require("../Model/NotificationModel");
const User = require("../Model/UserModel");

// ======================================
// Send Exchange Request
// ======================================

async function sendRequest(req, res) {
  try {
    const sender = req.userId;

    const {
      receiver,
      requestedSkill,
      offeredSkill,
      meetingMode,
      preferredDate,
      message,
    } = req.body;

    // Required fields
    if (!receiver || !requestedSkill || !offeredSkill) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Cannot send to yourself
    if (sender === receiver) {
      return res.status(400).json({
        success: false,
        message: "You cannot send a request to yourself",
      });
    }

    // Receiver must exist
    const receiverUser = await User.findById(receiver);

    if (!receiverUser) {
      return res.status(404).json({
        success: false,
        message: "Receiver not found",
      });
    }

    // Prevent duplicate pending requests
    const existingRequest = await ExchangeRequest.findOne({
      sender,
      receiver,
      requestedSkill,
      offeredSkill,
      status: "Pending",
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "You already sent this request.",
      });
    }

    // Create request
    const request = await ExchangeRequest.create({
      sender,
      receiver,
      requestedSkill,
      offeredSkill,
      meetingMode,
      preferredDate,
      message,
    });

    // Create notification
    await NotificationModel.create({
      user: receiver,
      sender,
      exchange: request._id,
      title: "New Skill Exchange Request",
      message: "You have received a new skill exchange request.",
      type: "Request",
    });

    // Return populated request
    const populatedRequest = await ExchangeRequest.findById(request._id)
      .populate("sender", "name email profileImage")
      .populate("receiver", "name email profileImage");

    return res.status(201).json({
      success: true,
      message: "Exchange request sent successfully.",
      request: populatedRequest,
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
}
// ======================================
// Received Requests
// ======================================

async function receivedRequests(req, res) {
  try {
    const requests = await ExchangeRequest.find({
      receiver: req.userId,
    })
      .populate(
        "sender",
        "name email profileImage skillsOffered skillsNeeded"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

// ======================================
// Sent Requests
// ======================================

async function sentRequests(req, res) {
  try {
    const requests = await ExchangeRequest.find({
      sender: req.userId,
    })
      .populate(
        "receiver",
        "name email profileImage skillsOffered skillsNeeded"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

// ======================================
// Get Single Request
// ======================================

async function getSingleRequest(req, res) {
  try {
    const request = await ExchangeRequest.findById(req.params.id)
      .populate("sender", "name email profileImage")
      .populate("receiver", "name email profileImage");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    if (
      request.sender._id.toString() !== req.userId &&
      request.receiver._id.toString() !== req.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      request,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

// ======================================
// Accept Request
// ======================================

async function acceptRequest(req, res) {
  try {
    const request = await ExchangeRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // Only receiver can accept
    if (request.receiver.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Only receiver can accept this request",
      });
    }

    // Request must be pending
    if (request.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Request has already been processed",
      });
    }

    // Update status
    request.status = "Accepted";
    await request.save();

    // Create notification for sender
    await NotificationModel.create({
      user: request.sender,
      sender: req.userId,
      exchange: request._id,
      title: "Exchange Request Accepted",
      message: "Your skill exchange request has been accepted.",
      type: "Accepted",
    });

    // Return updated request
    const updatedRequest = await ExchangeRequest.findById(request._id)
      .populate("sender", "name email profileImage")
      .populate("receiver", "name email profileImage");

    return res.status(200).json({
      success: true,
      message: "Request accepted successfully",
      request: updatedRequest,
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
}

// ======================================
// Reject Request
// ======================================

async function rejectRequest(req, res) {
  try {
    const request = await ExchangeRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // Only receiver can reject
    if (request.receiver.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Only receiver can reject this request",
      });
    }

    // Request must be pending
    if (request.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Request has already been processed",
      });
    }

    // Update status
    request.status = "Rejected";
    await request.save();

    // Notify sender
    await NotificationModel.create({
      user: request.sender,
      sender: req.userId,
      exchange: request._id,
      title: "Exchange Request Rejected",
      message: "Unfortunately, your skill exchange request was rejected.",
      type: "Rejected",
    });

    // Return updated request
    const updatedRequest = await ExchangeRequest.findById(request._id)
      .populate("sender", "name email profileImage")
      .populate("receiver", "name email profileImage");

    return res.status(200).json({
      success: true,
      message: "Request rejected successfully",
      request: updatedRequest,
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
}

// ======================================
// Cancel Request
// ======================================

async function cancelRequest(req, res) {
  try {
    const request = await ExchangeRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // Only sender can cancel
    if (request.sender.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Only sender can cancel this request",
      });
    }

    // Only pending requests can be cancelled
    if (request.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending requests can be cancelled",
      });
    }

    // Update status
    request.status = "Cancelled";
    await request.save();

    // Notify receiver
    await NotificationModel.create({
      user: request.receiver,
      sender: req.userId,
      exchange: request._id,
      title: "Exchange Request Cancelled",
      message: "The sender has cancelled the skill exchange request.",
      type: "Cancelled",
    });

    // Return updated request
    const updatedRequest = await ExchangeRequest.findById(request._id)
      .populate("sender", "name email profileImage")
      .populate("receiver", "name email profileImage");

    return res.status(200).json({
      success: true,
      message: "Request cancelled successfully",
      request: updatedRequest,
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
}
// ======================================
// Complete Request
// ======================================

// ======================================
// Complete Request
// ======================================

async function completeRequest(req, res) {
  try {
    const request = await ExchangeRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // Only sender or receiver can complete
    if (
      request.sender.toString() !== req.userId &&
      request.receiver.toString() !== req.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Only accepted requests can be completed
    if (request.status !== "Accepted") {
      return res.status(400).json({
        success: false,
        message: "Only accepted requests can be completed",
      });
    }

    // Update request status
    request.status = "Completed";
    await request.save();

    // Increment completed exchanges for both users
    await User.findByIdAndUpdate(request.sender, {
      $inc: {
        completedExchanges: 1,
      },
    });

    await User.findByIdAndUpdate(request.receiver, {
      $inc: {
        completedExchanges: 1,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Exchange completed successfully",
      request,
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
}

// ======================================
// Delete Request
// ======================================

async function deleteRequest(req, res) {
  try {
    const request = await ExchangeRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    if (request.sender.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Only sender can delete this request",
      });
    }

    await ExchangeRequest.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Request deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = {
  sendRequest,
  receivedRequests,
  sentRequests,
  getSingleRequest,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  completeRequest,
  deleteRequest,
};