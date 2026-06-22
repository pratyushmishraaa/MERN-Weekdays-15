import express from "express";
import { register } from "../controllers/auth.controller.js";
import { getAllUsers } from "../controllers/users.controller.js";


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/auth/v1/register", register);
app.get("/api/users/v1", getAllUsers);



app.get("/api/health", (req, res) => {
   res.status(200).json({
      "status": "ok"
   })
})

export default app;
