import asyncHandler from "../../utils/asyncHandler.utils.js";
import Product from "../../models/product.model.js";
import ApiError from "../../utils/errorHandler.utils.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.utils.js";

export const createProduct = asyncHandler(async (req, res, next) => {
   const {name,description , price,category, stock} = req.body;

   if(!name || !description || !price || !category){
      throw new ApiError(400, "All fields are required");
   }

   let imageUrl = undefined;
   let imagePublicId = undefined;

   if(req.file){
      const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
      if(cloudinaryResponse){
         imageUrl = cloudinaryResponse.secure_url;
         imagePublicId = cloudinaryResponse.public_id;
      }
   }
   
   const product = await Product.create({
      name,
      description,
      price,
      category,
      stock:stock || 0,
      image:imageUrl,
      imagePublicId,
   });
   
   res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
   })
})