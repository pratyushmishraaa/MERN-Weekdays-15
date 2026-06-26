import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./env/.env" });

const connectDB = async (retries = 3, delay = 2000) => {
  // If we already have a connection, reuse it
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // If a connection is currently in progress, wait for it
  if (mongoose.connection.readyState === 2) {
    return new Promise((resolve) => {
      mongoose.connection.once("open", () => resolve(mongoose.connection));
    });
  }

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("MongoDB Connection Error: MONGO_URI environment variable is not defined!");
    throw new Error("MONGO_URI environment variable is not defined!");
  }

  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Connecting to MongoDB... (Attempt ${i + 1}/${retries})`);
      // We set a lower timeout for serverless environments to avoid hitting Vercel's execution limits
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log("MongoDB connected successfully");
      return mongoose.connection;
    } catch (err) {
      console.error(
        `MongoDB connection failed (Attempt ${i + 1}/${retries}). Error:`,
        err.message
      );
      if (i === retries - 1) {
        throw new Error(`All connection retries failed: ${err.message}`);
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

export default connectDB;