import jwt from "jsonwebtoken";

const verificationToken = (req, res, next) => {
   const authHeader = req.headers.authorization;
   if(!authHeader || !authHeader.startsWith("Bearer ")){
      return res.status(401).json({message:"access denied due to no token provided"});
   }
   const token = authHeader.split(" ")[1];
   try{
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
   }
   catch(err){
      return res.status(401).json({message: "Invalid or expired token"});
   }
};
export default verificationToken;