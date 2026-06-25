/**
 * Run this script to create or reset an admin user directly in MongoDB.
 * Usage (from the backend folder):
 *   node utils/createAdminUser.js
 *
 * It will upsert (create or overwrite) the admin user with:
 *   email:    admin@shopx.com
 *   password: Admin@123
 *   role:     admin
 */

import dotenv from "dotenv";
dotenv.config({ path: "./env/.env" });

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import connectDB from "../config/db.config.js";

// ── CHANGE THESE IF YOU WANT ──────────────────────────────────────────────────
const ADMIN_USERNAME = "superadmin";
const ADMIN_EMAIL    = "admin@shopx.com";
const ADMIN_PASSWORD = "Admin@123";
// ─────────────────────────────────────────────────────────────────────────────

const run = async () => {
  try {
    await connectDB();

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Remove any existing user with this email or username to start clean
    await User.deleteOne({ $or: [{ email: ADMIN_EMAIL }, { username: ADMIN_USERNAME }] });
    console.log("Removed existing user (if any)");

    const user = await User.create({
      username: ADMIN_USERNAME,
      email:    ADMIN_EMAIL,
      password: hashedPassword,
      role:     "admin",
      avatar:   "https://images.pexels.com/photos/27278748/pexels-photo-27278748.jpeg",
    });

    console.log("─────────────────────────────────────────");
    console.log("✓ Admin user created successfully!");
    console.log("  Email   :", ADMIN_EMAIL);
    console.log("  Password:", ADMIN_PASSWORD);
    console.log("  Role    :", user.role);
    console.log("  ID      :", user._id);
    console.log("─────────────────────────────────────────");
    console.log("Go to http://localhost:5173/login and sign in.");

    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
};

run();
