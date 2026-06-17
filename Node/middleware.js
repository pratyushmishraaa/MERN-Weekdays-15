import express from "express";
import fs from "fs";
const app = express();
const PORT = 3000;
app.use(express.json());



// app.use((req,res,next)=>{
//    console.log("middleware");
//    next();
// })
// app.use((req,res,next)=>{
//    console.log("middleware 2 is called");
//    next();
   
// })

let username = "pratyush";
let password = "12345";

// app.use((req,res,next)=>{
//    if(req.body.username === username){
//       next()
//    }
//    else{
//       res.status(401).json({message:"Incorrect Username"})
//    }
// })

// app.use((req,res,next)=>{
//    if(req.body.password ===password){
//       next();
//    }
//    else{
//       res.status(401).json({message:"Incorrect Password"})
//    }
// })

// app.use((req,res,next)=>{
//    if(req.body.username === username && req.body.password ===password){
//       next();
//    }
//    else{
//       res.status(401).json({message:"Incorrect Credentials"})
//    }
// })


// app.use((req,res,next)=>{
//    fs.appendFile("entry.txt",`\n${req.body.username} logged in at ${Date.now()}\n`,(err,data)=>{
//       if(err) res.status(401).json({err:err.message});
//       res.status(200).json({message:"Entry Done"})
//    })
// })


// route level middleware

// app.post("/register", (req, res,next) => {
//    if(req.body.username === "pratyush"){
//       return res.json({message:"success"});
//       next();
//    }
//    else{
//       return res.status(401).json({message:"err"})
//    }
   
// })

//error level  middleware


app.use((err,req,res,next)=>{
   res.status(401).json({message:err.message})
})


app.post("/register", (req, res,next) => {
   if(req.body.username === "pratyush"){
      return res.json({message:"success dubara"});
   }
   next(new Error("Invalid username"))
});


app.post("/login",(req,res)=>{
   res.status(202).json({
      message:"Login successfull"
   });
 
})


app.get("/",(req,res)=>{
   res.send("Home Page");
});





app.listen(PORT, () => {
   console.log(`Server running at http://localhost:${PORT}`);
});