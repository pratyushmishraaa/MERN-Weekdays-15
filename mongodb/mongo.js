import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
dotenv.config();


const app = express();


app.use(express.json());
app.use(express.urlencoded({extended:true}));

const PORT = process.env.PORT || 3000;

const userSchema = new mongoose.Schema({
   username:{
      type: String,
      required: true,
      unique: true,
   },
   password:{
      type: String,
      required: true,
   },
   email:{
      type: String,
      required: true,
      unique: true,
   } 
});

const User = mongoose.model("User",userSchema);

// app.post("/api/v1/auth/register", async(req, res) => {
//    const{username,email} = req.body;
//    const password = req.body.password;

//    if (!username || !email || !password) {
//       return res.status(400).json({message:"Username, email and password are required"});
//    }

//    try{
//       const hashedPassword = await bcrypt.hash(password, 10);
//       const user = new User({username,email,password:hashedPassword});
//       const savedUser = await user.save();
//       if(!savedUser){
//           return res.status(400).json({message:"User not created"})
//          };
//       return res.status(201).json({message:"User created successfully"});
//    } 
//    catch(err){
//       if (err.code === 11000) {
//          return res.status(409).json({message:"Username or email already exists"});
//       }

//       return res.status(500).json({message: err.message});
//    }
// })

// app.get("/api/v1/auth/users", async(req, res) => {
//    try{
//       const users = await User.find();
//       if(!users){
//          return res.status(404).json({message:"Users not found"});
//       }
//       return res.status(200).json(users);
//    }
//    catch(err){
//       return res.status(500).json({message: err.message});

//    }
// })

//Update User 

// app.put("/api/v1/users/:id", async(req, res) => {
//    try{
//       const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
//       if(!updatedUser){
//          return res.status(404).json({message:"User not found"});
//       }
//       res.status(200).json(updatedUser);
//    }
//    catch(err){
//       return res.status(500).json({message: err.message});
//    }
// })


// //Delete Userr
// app.delete("/api/v1/users/:id", async(req, res) => {
//    try{
//       const deletedUser = await User.findByIdAndDelete(req.params.id);
//       if(!deletedUser){
//          return res.status(404).json({message:"User not found"});
//       }
//       return res.status(200).json({message:"User deleted successfully"});
//    } 
//    catch(err){
//       return res.status(500).json({message: err.message});
//    }  
// })


app.post("/api/v1/auth/login", async(req, res) => {
   const{email,password} = req.body;
   try{
      const user = await User.findOne({email});
      if(!user){
         return res.status(404).json({message:"User not found"});
      }
      const isMatched = await bcrypt.compare(password, user.password);
      if(!isMatched){
         return res.status(401).json({message:"Invalid credentials"});
      }

//token
const token  = jwt.sign({id:user._id,email:user.email},process.env.SECRET_KEY,{expiresIn:"1d"});
if(!token){
   return res.status(500).json({message:"Token not generated"});
}
res.cookie("token",token,{
   httpOnly:true,
   maxAge: 24*60*60*1000,
})
if(!res.cookie){
   return;

}
res.status(200).json({message:"Login successful"});
   }
   catch(err){
      return res.status(500).json({message: err.message});
   }
});



//verification middleware
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


app.get("/api/v1/auth/users", verificationToken,async(req, res) => {
   try{
      const users = await User.find();
      if(!users){
         return res.status(404).json({message:"Users not found"});
      }
      return res.status(200).json(users);
   }
   catch(err){
      return res.status(500).json({message: err.message});

   }
})



mongoose.connect(process.env.MONGO_URI)
   .then(() => {
      console.log("Connected to MongoDB");
      app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
   })
   .catch((err) => {
      console.log("MongoDB connection failed:", err.message);
   });
