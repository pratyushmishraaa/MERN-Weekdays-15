import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.utils.js";

const SALT_ROUNDS = 12;

const createToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

const publicUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  role: user.role,
});

export const register = asyncHandler(async (req, res) => {
  const username =
    typeof req.body?.username === "string" ? req.body.username.trim() : "";
  const email =
    typeof req.body?.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";
  const password = req.body?.password;
  const role =
    typeof req.body?.role === "string"
      ? req.body.role.trim().toLowerCase()
      : "user";

  if (!username || !email || typeof password !== "string") {
    return res.status(400).json({
      message: "Username, email and password are required",
    });
  }

  if (username.length < 3 || username.length > 30) {
    return res.status(400).json({
      message: "Username must be between 3 and 30 characters",
    });
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: "Please provide a valid email" });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters",
    });
  }

  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({
      message: "Role must be either user or admin",
    });
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    return res.status(409).json({
      message:
        existingUser.email === email
          ? "Email is already registered"
          : "Username is already taken",
    });
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    role,
  });

  return res.status(201).json({
    message: "User registered successfully",
    user: publicUser(user),
  });
});

export const login = asyncHandler(async (req, res) => {
  const email =
    typeof req.body?.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";
  const password = req.body?.password;

  if (!email || typeof password !== "string" || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const token = createToken(user);

  return res.status(200).json({
    message: "Login successful",
    token,
    user: publicUser(user),
  });
});
