import asyncHandler from "../../utils/asyncHandler.utils.js";
import User from "../../models/user.model.js";
import ApiError from "../../utils/errorHandler.utils.js";

export const updateUser = asyncHandler(async(req,res,next)=>{
   const userId = req.user?._id;
   if(!userId){
      throw new ApiError(401, "User not authenticated");
   }
   
   //only allow safe fields to be updated

   const {username,avatar} = req.body;
   const allowedUpdates ={};
   if(username !== undefined) allowedUpdates.username = username;
   if(avatar !== undefined) allowedUpdates.avatar = avatar;

   const updatedUser = await User.findByIdAndUpdate(userId,
      {$set:allowedUpdates},
      {new:true,runValidators:true}
   ).select("-password");

   if(!updatedUser){
      throw new ApiError(404, "User not found");
   }

   res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
   });
});