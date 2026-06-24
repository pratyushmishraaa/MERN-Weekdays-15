import asyncHandler from "../../utils/asyncHandler.utils.js";
import User from "../../models/user.model.js";
import bcrypt from "bcryptjs";
import ApiError from "../../utils/errorHandler.utils.js";
import {uploadOnCloudinary} from "../../utils/cloudinary.utils.js";
import {sendEmail} from "../../utils/email.utils.js";


export const register= asyncHandler(async(req,res,next)=>{
  const{username,email,password,role}= req.body;

  if(!username || !email || !password){
    throw new ApiError(400,"All fields are required");
  }
  const existingUser = await User.findOne({$or: [{email}, {username}]});
  if(existingUser){
    throw new ApiError(400,"User already exists");
  }
  //Handle Avatar Upload 
  let avatarUrl = "https://images.pexels.com/photos/27278748/pexels-photo-27278748.jpeg";
  let avatarPublicId = "";
  //if a file is uploaded use it , otherwise use the hardcoded url ;

  const sourceToUpload = req.file ? req.file.path : avatarUrl;

  console.log("Source for Cloudinary:", sourceToUpload);

  const cloudinaryResponse = await uploadOnCloudinary(sourceToUpload);
  console.log("Cloudinary Response:", cloudinaryResponse);

  if(cloudinaryResponse){
    avatarUrl = cloudinaryResponse.secure_url;
    avatarPublicId = cloudinaryResponse.public_id;
  } else{
    console.error("Cloudinary upload failed - check your credentials in .env")
  }

  const hashedPassword = await bcrypt.hash(password,10);

  const user = await User.create({
    username,
    email,
    password:hashedPassword,
    role:role||"user",
    avatar:avatarUrl||undefined,
    avatarPublicId,

  });
  const createdUser = await User.findById(user._id).select("-password");
  
  if(!createdUser){
    throw new ApiError(500,"User not found -Something went wrong while registering");
  }

  //Send Email 

  try{
    await sendEmail({
      email:createdUser.email,
      subject:"Welcome to our shopX platform",
      message:`Hi ${createdUser.username}, Welcome to our platform`,
      html:`<h1>Hi ${createdUser.username}, Welcome to our platform</h1>`,
    });
  } catch(emailError){
    console.error(" Welcome Email failed to sent:", emailError);
  }
  res.status(200).json({
    success:true,
    message:"User registered successfully",
    data:createdUser,
  });

  });

export default register;





