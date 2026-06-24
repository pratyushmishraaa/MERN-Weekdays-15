import express from "express";
import { getAllUsers } from "../controllers/user/getAllUsers.controller.js";
import { updateUser } from "../controllers/user/updateUser.controller.js";
import { deleteUser } from "../controllers/user/deleteUser.controller.js";
import {getAllUsersLimiter,updateProfileLimiter,deleteProfileLimiter} from "../config/rateLimit.config.js";
import verificationToken from "../middlewares/verifyToken.middle.js";
import isAdmin from "../middlewares/isAdmin.middle.js";

const userRouter = express.Router();

userRouter.get("/allusers",verificationToken,isAdmin,getAllUsersLimiter,getAllUsers);
userRouter.put("/updateprofile",verificationToken,updateProfileLimiter,updateUser);
userRouter.delete("/deleteprofile",verificationToken,deleteProfileLimiter,deleteUser);

export default userRouter;