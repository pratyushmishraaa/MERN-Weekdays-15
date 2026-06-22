import app from "./src/app.js"
import dotenv from "dotenv";
import connectDB from "./config/db.config.js";
import {connect} from "mongoose"
dotenv.config({path:"./env/.env"});

connectDB();
const PORT = process.env.PORT || 3000;

app.listen(process.env.PORT, () => {
   console.log(` app listening on port ${process.env.PORT}`)
})