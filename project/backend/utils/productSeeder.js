import mongoose from "mongoose"
import dotenv from "dotenv"
import Product from "../models/product.model.js";
import connectDB from "../config/db.config.js"; 

dotenv.config({ path: "./env/.env" });

const seedProducts = async ()=>{
   try{
      await connectDB();
      //insert product      
      console.log("Fetching product from an API");
      const response = await fetch("https://dummyjson.com/products");
      const data = await response.json();

      if(!data.products || !Array.isArray(data.products)){
         throw new Error("Product data not found");
      }

      //MAP DummyJSON products to our product model 
      const mappedProducts = data.products.map((p)=>({
         name:p.title,
         description:p.description,
         price:p.price,
         category:p.category,
         stock:p.stock,
         image:p.images[0],
      })); 

      //Inserted new Products
      await Product.insertMany(mappedProducts);
      console.log(`Successfully seeded ${mappedProducts.length} products from DummyJSON`);
      process.exit(0);
   }
      
      
   catch(error){
      console.log(error.message,"Error Seedinf products");
      process.exit(1);

   }
};

seedProducts();