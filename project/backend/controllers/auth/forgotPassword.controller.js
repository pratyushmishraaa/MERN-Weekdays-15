import crypto from "crypto";
import bcrypt from "bcryptjs";
import asyncHandler from "../../utils/asyncHandler.utils.js";
import User from "../../models/user.model.js";
import ApiError from "../../utils/errorHandler.utils.js";
import { sendEmail } from "../../utils/email.utils.js";

// In-memory store for reset tokens { token -> { userId, expires } }
// In production, store these in MongoDB with a TTL index instead
const resetTokens = new Map();

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, "Email is required");

  const user = await User.findOne({ email: email.toLowerCase() });

  // Always respond with success to prevent email enumeration
  if (!user) {
    return res.status(200).json({
      success: true,
      message: "If this email exists, a reset link has been sent.",
    });
  }

  // Generate a secure random token
  const token   = crypto.randomBytes(32).toString("hex");
  const expires = Date.now() + 15 * 60 * 1000; // 15 minutes

  // Store token (overwrite any existing)
  resetTokens.set(token, { userId: user._id.toString(), expires });

  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${token}`;

  await sendEmail({
    email: user.email,
    subject: "ShopX — Password Reset Request",
    message: `You requested a password reset. Click the link to reset your password: ${resetUrl}\n\nThis link expires in 15 minutes. If you did not request this, ignore this email.`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px">
        <h2 style="color:#4f46e5;margin-bottom:8px">Reset your password</h2>
        <p style="color:#374151;margin-bottom:24px">
          Hi <strong>${user.username}</strong>, we received a request to reset your ShopX password.
          Click the button below — this link expires in <strong>15 minutes</strong>.
        </p>
        <a href="${resetUrl}" style="display:inline-block;background:#4f46e5;color:white;font-weight:600;padding:12px 28px;border-radius:12px;text-decoration:none;margin-bottom:24px">
          Reset Password
        </a>
        <p style="color:#6b7280;font-size:13px">
          If you didn't request this, you can safely ignore this email.<br/>
          Link: <a href="${resetUrl}" style="color:#4f46e5">${resetUrl}</a>
        </p>
      </div>
    `,
  });

  res.status(200).json({
    success: true,
    message: "If this email exists, a reset link has been sent.",
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) throw new ApiError(400, "Password is required");
  if (password.length < 6) throw new ApiError(400, "Password must be at least 6 characters");

  const record = resetTokens.get(token);
  if (!record) throw new ApiError(400, "Invalid or expired reset link");
  if (Date.now() > record.expires) {
    resetTokens.delete(token);
    throw new ApiError(400, "Reset link has expired. Please request a new one.");
  }

  const user = await User.findById(record.userId);
  if (!user) throw new ApiError(404, "User not found");

  user.password = await bcrypt.hash(password, 10);
  await user.save();

  // Invalidate the token
  resetTokens.delete(token);

  res.status(200).json({ success: true, message: "Password reset successfully. You can now log in." });
});
