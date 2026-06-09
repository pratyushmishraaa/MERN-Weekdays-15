import fs from "fs";
console.log(fs);
fs.writeFileSync("paras.txt","Hello i am Paras");
fs.writeFile("pratyush.txt","Hello I am pratyush Mishra",(err,data)=>{
   if(err){
      console.log(err);
   }
   else{
      console.log(data);
   }
})
fs.writeFile("pratyush.txt","Hello I am pratyush Mishra Onece again I am here",(err,data)=>{
   if(err){
      console.log(err);
   }
   else{
      console.log(data);
   }
})
fs.appendFile("pratyush.pdf","\nHello Paras Kya haal h ",(err,data)=>{
   if(err){
      console.log(err);
   }
   else{
      console.log(data);
   }
})
fs.readFile("pratyush.txt","utf-8",(err,data)=>{
   if(err){
      console.log(err);
   }
   else{
      console.log(data);
   }
})
fs.unlink("paras.txt",(err,data)=>{
   if(err){
      console.log(err);
   }
   else{
      console.log(data);
   }
})