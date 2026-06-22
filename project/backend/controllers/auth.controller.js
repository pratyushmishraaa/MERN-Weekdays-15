// import express from "express";

// const authController = express.Router();


// export default authController;
import asyncHandler from "../utils/asyncHandler.utils.js";

export const register = asyncHandler(async(req,res,next)=>{
   //TODO : Write register logic
   res.status(200).json({message:" Successfully registered"});
})