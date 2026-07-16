const mongoose = require("mongoose");

const ExchangeRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    requestedSkill: {
      type: String,
      required: true,
    },

    offeredSkill: {
      type: String,
      required: true,
    },

    meetingMode: {
      type: String,
      enum: ["Online", "Offline", "Either"],
      default: "Either",
    },

    preferredDate: {
      type: Date,
    },

    message: {
      type: String,
      maxlength: 500,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "Rejected",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ExchangeRequest",
  ExchangeRequestSchema
);