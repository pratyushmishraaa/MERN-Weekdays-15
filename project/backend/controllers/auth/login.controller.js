import asyncHandler from "../../utils/asyncHandler.utils.js";
import User from "../../models/user.model.js";
import bcrypt from "bcryptjs";
import ApiError from "../../utils/errorHandler.utils.js";
import jwt from "jsonwebtoken";

export const login = asyncHandler(async(req,res ,next)=>{
   const{email,password} = req.body;
   if(!email || !password){
      throw new ApiError(400,"Both fields are required");
   }
   const user = await User.findOne({email}).select("+password");
   if(!user){
      throw new ApiError(404,"Invalid credentials");
   }
   const isPasswordCorrect = await bcrypt.compare(password, user.password);
   if(!isPasswordCorrect){
      throw new ApiError(400,"Invalid credentials");
   }

   // Include role in payload so isAdmin middleware works without an extra DB query
   const token = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
   );

   const cookieOptions = {
      httpOnly:true,
      secure:process.env.NODE_ENV === "production",
      maxAge: Number(process.env.JWT_COOKIE_EXPIRES || 7) * 24 * 60 * 60 * 1000,
   }

   res.status(200).cookie("token",token,cookieOptions).json({
      status:true,
      message:"Login successful",
      user:{
         id:user._id,
         username:user.username,
         email:user.email,
         role:user.role
      },
      token,
   });
});

export default login;