const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    // =============================
    // BASIC INFORMATION
    // =============================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // =============================
    // PROFILE
    // =============================

    profileImage: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default:
        "Hello neighbors! Excited to share my skills and learn something new.",
      maxlength: 500,
    },

    city: {
      type: String,
      default: "",
      trim: true,
    },

    state: {
      type: String,
      default: "",
      trim: true,
    },

    country: {
      type: String,
      default: "India",
    },

    // =============================
    // SKILLS
    // =============================

    skillsOffered: [
      {
        type: String,
        trim: true,
      },
    ],

    skillsNeeded: [
      {
        type: String,
        trim: true,
      },
    ],

    experience: {
      type: String,
      enum: [
        "Beginner",
        "Intermediate",
        "Advanced",
        "Expert",
      ],
      default: "Beginner",
    },

    availability: {
      type: String,
      enum: [
        "Weekdays",
        "Weekends",
        "Evenings",
        "Anytime",
      ],
      default: "Anytime",
    },

    // =============================
    // COMMUNITY
    // =============================

    rating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    completedExchanges: {
      type: Number,
      default: 0,
    },

    ratings: [
      {
        reviewerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        score: {
          type: Number,
          min: 1,
          max: 5,
        },

        feedback: {
          type: String,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // =============================
    // ACCOUNT
    // =============================

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastSeen: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);