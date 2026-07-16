const mongoose = require("mongoose");

async function ConnectDB() {
  try {
    console.log("Connecting to:", process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("✅ Connected");
  } catch (err) {
    console.error("Error name:", err.name);
    console.error("Error code:", err.code);
    console.error("Error message:", err.message);
    console.error(err);
    process.exit(1);
  }
}

module.exports = ConnectDB;