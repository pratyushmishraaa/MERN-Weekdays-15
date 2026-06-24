import ApiError from "../utils/errorHandler.utils.js";

const isAdmin = (req,res,next)=>{
   if(req.user && req.user.role === "admin"){
      next();
   }
   else{
      throw new ApiError(403,"Not authorized to access|| Only Admin is alloweed");
   }
};

export default isAdmin;