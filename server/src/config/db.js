const mongoose = require("mongoose");
/**
 * Establishes a connection to MongoDB using MONGODB_URI.
 * Throws an error if the connection string is missing.
 * Waits for the database connection before the application proceeds.
 */
async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is missing in .env");
  }

  await mongoose.connect(uri);
  console.log("MongoDB connected");
}

module.exports = connectDB;
