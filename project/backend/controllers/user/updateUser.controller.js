import asyncHandler from "../../utils/asyncHandler.utils.js";
import User from "../../models/user.model.js";
import ApiError from "../../utils/errorHandler.utils.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../../utils/cloudinary.utils.js";

export const updateUser = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "User not authenticated");

  const allowedUpdates = {};

  // Username update
  const { username } = req.body;
  if (username !== undefined) allowedUpdates.username = username;

  // Avatar upload — if a file was sent via multipart
  if (req.file) {
    // Get current user to delete old Cloudinary image
    const currentUser = await User.findById(userId).select("avatarPublicId");
    if (currentUser?.avatarPublicId) {
      await deleteFromCloudinary(currentUser.avatarPublicId);
    }

    const uploaded = await uploadOnCloudinary(req.file.path);
    if (!uploaded) throw new ApiError(500, "Image upload failed. Check Cloudinary credentials.");

    allowedUpdates.avatar          = uploaded.secure_url;
    allowedUpdates.avatarPublicId  = uploaded.public_id;
  }

  if (Object.keys(allowedUpdates).length === 0) {
    throw new ApiError(400, "Nothing to update");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: allowedUpdates },
    { new: true, runValidators: true }
  ).select("-password");

  if (!updatedUser) throw new ApiError(404, "User not found");

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: updatedUser,
  });
});