import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import authRouter from "../routes/auth.routes.js";
import usersRouter from "../routes/users.routes.js";
import ordersRouter from "../routes/order.routes.js";
import productRouter from "../routes/product.routes.js";
import errorMiddleware from "../middlewares/error.middle.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendPublicPath = path.resolve(__dirname, "../public");
const frontendDistPath = path.resolve(backendPublicPath, "dist");

const app = express();

app.use(express.static(backendPublicPath));
app.use(express.static(frontendDistPath));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// API routes
app.use("/api/auth/v1", authRouter);
app.use("/api/users/v1", usersRouter);
app.use("/api/orders/v1", ordersRouter);
app.use("/api/products/v1", productRouter);

app.get("/api/health", (req, res) => {
  res.send("OK");
});

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(frontendDistPath, "index.html"));
});

app.use(errorMiddleware);

export default app;