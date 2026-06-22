import express from "express";
import { login, register } from "../controllers/auth.controller.js";
import { getAllUsers } from "../controllers/users.controller.js";


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/auth/v1/register", register);
app.post("/api/auth/v1/login", login);
app.get("/api/users/v1", getAllUsers);





app.use((err, req, res, next) => {
   if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
      return res.status(400).json({
         message: "Invalid JSON request body"
      });
   }

   console.error(err);
   return res.status(500).json({
      message: "Internal server error"
   });
});


app.get("/api/health", (req, res) => {
   res.status(200).json({
      "status": "ok"
   })
})

export default app;
