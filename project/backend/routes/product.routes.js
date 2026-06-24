import express from "express";
import { getAllProducts } from "../controllers/product/getAllProducts.controller.js";
import { getProductById } from "../controllers/product/getProductById.controller.js";
import { createProduct } from "../controllers/product/createProduct.controller.js";
import { updateProduct } from "../controllers/product/updateProduct.controller.js";
import { deleteProduct } from "../controllers/product/deleteProduct.controller.js";
//todo : you can make limiter of this
// import {getAllProductsLimiter,createProductLimiter,updateProductLimiter,deleteProductLimiter} from "../config/rateLimit.config.js";
import verificationToken from "../middlewares/verifyToken.middle.js";
import isAdmin from "../middlewares/isAdmin.middle.js";
import upload from "../config/multer.config.js";

const productRouter = express.Router();

//puvlic routes

productRouter.get("/",getAllProducts);
productRouter.get("/:id",getProductById);

//admin only routes 

productRouter.post("/",verificationToken,isAdmin,upload.single("image"),createProduct);
productRouter.put("/:id",verificationToken,isAdmin,upload.single("image"),updateProduct);
productRouter.delete("/:id",verificationToken,isAdmin,deleteProduct);

export default productRouter;