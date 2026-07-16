// const NotificationModel = require("../Model/NotificationModel");
// const Notification = require("../Model/NotificationModel");

const NotificationModel = require("../Model/NotificationModel");

// ======================================
// Get Notifications
// ======================================

async function getNotifications(req, res) {
  try {

    const notifications = await NotificationModel.find({
      user: req.userId,
    })
      .populate("sender", "name profileImage")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
}

// ======================================
// Mark One Read
// ======================================

async function markAsRead(req, res) {
  try {

    const notification = await NotificationModel.findById(
      req.params.id
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    if (notification.user.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    notification.isRead = true;

    await NotificationModel.save();

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
}

// ======================================
// Mark All Read
// ======================================

async function markAllRead(req, res) {
  try {

    await NotificationModel.updateMany(
      {
        user: req.userId,
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
}

// ======================================
// Delete Notification
// ======================================

async function deleteNotification(req, res) {
  try {

    const notification = await NotificationModel.findById(
      req.params.id
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    if (notification.user.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await NotificationModel.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Notification deleted",
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
}

module.exports = {
  getNotifications,
  markAsRead,
  markAllRead,
  deleteNotification,
};