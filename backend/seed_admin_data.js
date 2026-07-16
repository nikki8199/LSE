require("dotenv").config();
const mongoose = require("mongoose");
const ConnectDB = require("./Config/ConnectionDB");
const User = require("./Model/UserModel");
const ExchangeRequest = require("./Model/ExchangeRequestModel");
const Review = require("./Model/ReviewModel");
const Complaint = require("./Model/ComplaintModel");

async function seed() {
  await ConnectDB();

  try {
    console.log("Seeding admin dashboard demonstration data...");

    // Find users
    const users = await User.find();
    if (users.length < 2) {
      console.log("❌ Not enough users in database to seed complaints/reviews. Please register at least 2 users first.");
      process.exit(0);
    }

    const u1 = users[0];
    const u2 = users[1];

    // Delete existing complaints to avoid duplicate build-up
    await Complaint.deleteMany({});
    console.log("Cleared old complaints.");

    // Seed mock complaints
    const mockComplaints = [
      {
        user: u1._id,
        title: "Exchange partner missed session",
        description: "We scheduled a React coaching session yesterday at 3 PM but the other member did not show up or reply to messages. Requesting cancellation refund.",
        category: "User Behavior",
        status: "pending",
        targetUser: u2._id,
      },
      {
        user: u2._id,
        title: "Video upload error 500",
        description: "Whenever I attempt to post an MP4 video of size 12MB, the request crashes with server code 500. Please inspect upload limits.",
        category: "Technical Issue",
        status: "pending",
      },
      {
        user: u1._id,
        title: "Offensive language in profile text",
        description: "The description of this profile contains terms that violate community standards. Please moderate.",
        category: "Content Violation",
        status: "resolved",
        targetUser: u2._id,
      },
    ];

    await Complaint.insertMany(mockComplaints);
    console.log("✅ Seeded 3 mock complaints.");

    // Seed mock reviews if they don't exist
    const exchange = await ExchangeRequest.findOne({ status: "Completed" }) || 
                     await ExchangeRequest.create({
                       sender: u1._id,
                       receiver: u2._id,
                       offeredSkill: u1.skillsOffered[0] || "React",
                       requestedSkill: u2.skillsOffered[0] || "English",
                       status: "Completed",
                       date: new Date(),
                     });

    const reviewsCount = await Review.countDocuments();
    if (reviewsCount === 0) {
      const mockReviews = [
        {
          exchange: exchange._id,
          reviewer: u1._id,
          reviewee: u2._id,
          rating: 5,
          review: "Excellent explanation of English idioms. Incredibly patient and helpful mentor!",
        },
        {
          exchange: exchange._id,
          reviewer: u2._id,
          reviewee: u1._id,
          rating: 4,
          review: "Very structured React hooks overview. Explained states and side effects perfectly.",
        }
      ];

      try {
        await Review.insertMany(mockReviews);
        console.log("✅ Seeded 2 mock reviews.");
      } catch (e) {
        console.log("Could not seed mock reviews (possibly index duplicate). Bypassing.");
      }
    }

    console.log("🎉 Seeding complete successfully!");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    mongoose.connection.close();
  }
}

seed();
