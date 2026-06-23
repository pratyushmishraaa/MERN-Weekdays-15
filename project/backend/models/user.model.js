import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username:{
    type:String,
    required:[true,"Username is required"],
    unique:true,
    trim:true,
    minlength:[3,"Username must be at least 3 characters long"],
    maxlength:[20,"Username must be at most 20 characters long"]
  },
  email:{
    type:String,
    required:[true,"Email is required"],
    unique:true,
    trim:true,
    lowercase:true
  },
  password:{
    type:String,
    required:[true,"Password is required"],
    minlength:[6,"Password must be at least 6 characters long"],
    select:false,
  },
  role:{
    type:String,
    enum:["user","admin"],
    default:"user"
  },
  avatar:{
    type:String,
    default:"https://images.pexels.com/photos/27278748/pexels-photo-27278748.jpeg"
  },
  avatarPublicId:{
    type:String,

  },
},
{
timestamps:true,
}

);

const User = mongoose.model("User",userSchema);
export default User;