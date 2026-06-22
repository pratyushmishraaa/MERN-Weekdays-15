import app from "./src/app.js"
import dotenv from "dotenv";
import connectDB from "./config/db.config.js";
dotenv.config({path:"./env/.env"});

connectDB();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
   console.log(`app listening on port ${PORT}`)
})
