import express from "express";
// console.log(express);
import fs from "fs";

const app = express();
const PORT = 8080;
app.use(express.json());
app.get("/",(req,res)=>{
   res.send("Home Page");
})

app.get("/about",(req,res)=>{
   res.send("About Page");
})

app.post("/login",(req,res)=>{
   // res.send("Login Page");
   res.status(202).json({
      message:"Login successfull"
   });
   console.log(res.body);
})


app.get("/contact",(req,res)=>{
   res.send("Contact Page");
})

app.get("/product",(req,res)=>{
   // res.end("Hello from product page!");
   // res.json("./product.json");
   fs.readFile("./product.json","utf-8",(err,data)=>{
      if(err) res.status(404).json({message:"page not found"});
      res.status(200).json(data);
   })
})
app.listen(PORT, () => {
   console.log(`Server running at http://localhost:${PORT}`);
});