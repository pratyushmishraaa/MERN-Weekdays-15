// import express from "express";

// const usersController = express.Router();

// export default usersController;
import asyncHandler from "../utils/asyncHandler.utils.js";

export const getAllUsers = asyncHandler(async(req,res,next)=>{
   //TODO : Write getAllUsers logic
   res.status(200).json({message:" Successfully fetched all users"});
})