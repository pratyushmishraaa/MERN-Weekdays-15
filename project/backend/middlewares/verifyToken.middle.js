const verificationToken = (req, res, next) => {
   const authHeader = req.headers.authorization;
   if(!authHeader || !authHeader.startsWith("Bearer ")){
      return res.status(401).json({message:"access denied due to no token provided"});
   
   }
   const token = authHeader.split(" ")[1];
   try{
      const decoded =jwt.verify(token,process.env.SECRET_KEY);
      req.user = decoded;
      next();
   }
   catch(err){
      return res.status(500).json({message: err.message});
   }
;}
export default verificationToken;