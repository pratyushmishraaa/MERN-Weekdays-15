import express from "express";
import authController from "../controllers/auth.controller";
import usersController from "../controllers/users.controller";


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth/v1", authController);
app.use("/api/users/v1", usersController);



app.get("/api/health", (req, res) => {
   res.status(200).json({
      "status": "ok"
   })
})

export default app;