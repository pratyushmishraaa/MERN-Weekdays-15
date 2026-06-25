import asyncHandler from "../../utils/asyncHandler.utils.js";
import User from "../../models/user.model.js";
import bcrypt from "bcryptjs";
import ApiError from "../../utils/errorHandler.utils.js";

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Both current and new password are required");
  }
  if (newPassword.length < 6) {
    throw new ApiError(400, "New password must be at least 6 characters");
  }
  if (currentPassword === newPassword) {
    throw new ApiError(400, "New password must be different from current password");
  }

  const user = await User.findById(req.user._id).select("+password");
  if (!user) throw new ApiError(404, "User not found");

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new ApiError(400, "Current password is incorrect");

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.status(200).json({ success: true, message: "Password changed successfully" });
});
