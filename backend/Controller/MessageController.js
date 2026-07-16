const Message = require("../Model/MessageModel");
const User = require("../Model/UserModel");

// ======================================
// Send Message
// ======================================
async function sendMessage(req, res) {
  try {
    const sender = req.userId;
    const { receiver, text } = req.body;

    if (!receiver || !text) {
      return res.status(400).json({
        success: false,
        message: "Please specify receiver and text",
      });
    }

    if (sender === receiver) {
      return res.status(400).json({
        success: false,
        message: "You cannot chat with yourself",
      });
    }

    const message = await Message.create({
      sender,
      receiver,
      text,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name email profileImage")
      .populate("receiver", "name email profileImage");

    return res.status(201).json({
      success: true,
      message: populatedMessage,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

// ======================================
// Get Conversations list
// ======================================
async function getConversations(req, res) {
  try {
    const userId = req.userId;

    // Find all messages involving the logged-in user
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .sort({ createdAt: -1 })
      .populate("sender", "name email profileImage role")
      .populate("receiver", "name email profileImage role");

    // Group last messages by contact ID
    const conversationMap = new Map();

    for (const msg of messages) {
      const partner = msg.sender._id.toString() === userId ? msg.receiver : msg.sender;
      const partnerId = partner._id.toString();

      if (!conversationMap.has(partnerId)) {
        conversationMap.set(partnerId, {
          id: partnerId,
          name: partner.name,
          email: partner.email,
          profileImage: partner.profileImage,
          role: partner.role,
          lastMessage: msg.text,
          time: msg.createdAt,
          unread: !msg.isRead && msg.receiver._id.toString() === userId,
        });
      }
    }

    const conversations = Array.from(conversationMap.values());

    return res.status(200).json({
      success: true,
      count: conversations.length,
      conversations,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

// ======================================
// Get Message Thread
// ======================================
async function getMessageThread(req, res) {
  try {
    const userId = req.userId;
    const partnerId = req.params.userId;

    // Retrieve all messages between user and partner
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: partnerId },
        { sender: partnerId, receiver: userId },
      ],
    }).sort({ createdAt: 1 });

    // Mark received messages in this thread as read
    await Message.updateMany(
      { sender: partnerId, receiver: userId, isRead: false },
      { $set: { isRead: true } }
    );

    return res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = {
  sendMessage,
  getConversations,
  getMessageThread,
};
