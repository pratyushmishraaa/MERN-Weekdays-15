import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true,"Product name is required"],
    trim:true,
  },
  description:{
    type:String,
    required:[true,"Product description is required"],
  },
  price:{
    type:Number,
    required:[true,"Product price is required"],
    min:[0,"Product price must be greater than 0"],
  },
  category:{
    type:String,
    required:[true,"Product category is required"],
    trim:true,
  },
  stock:{
    type:Number,
    required:[true,"Product stock is required"],
    default:0,
  },
  image:{
    type:String,
    default:"https://images.pexels.com/photos/34702609/pexels-photo-34702609.jpeg",
  },
  imagePublicId:{
    type:String,
  },

},
{
  timestamps:true,
}
);

const Product = mongoose.model("Product", productSchema);

export default Product;