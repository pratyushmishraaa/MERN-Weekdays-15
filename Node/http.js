import http from "http";

const PORT = 5050;

const server = http.createServer((req, res) => {
   // res.end("Hello World");
   // res.statusCode = 404;
   // res.setHeader("author","abhinav");

   if(req.url ==="/"){
      res.end("Home Page");
   }
   if(req.url ==="/about"){
      res.end("About Page");
   }
   if(req.url ==="/contact"){
      res.end("Contact Page");
   }
})

server.listen(PORT, () => {
   console.log(`Server running at http://localhost:${PORT}`);
});