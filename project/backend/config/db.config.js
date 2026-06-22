import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({path:"./env/.env"});

const connectDB = async()=>{
   try{
      await mongoose.connect(process.env.MONGO_URI);
      console.log("Connected to MongoDB");
   }
   catch(err){
      console.log("MongoDB connection failed:", err.message);
      process.exit(1);
   }
}

export default connectDB;