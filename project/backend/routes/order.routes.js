import express from "express";
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  cancelOrder,
  verifyPayment,
} from "../controllers/order.controller.js";
import verificationToken from "../middlewares/verifyToken.middle.js";

const ordersRouter = express.Router();

ordersRouter.use(verificationToken);

ordersRouter.post("/create",           createOrder);
ordersRouter.post("/verify-payment",   verifyPayment);
ordersRouter.get("/my-orders",         getUserOrders);
ordersRouter.get("/all",               getAllOrders);
ordersRouter.get("/:id",               getOrderById);
ordersRouter.put("/status/:id",        updateOrderStatus);
ordersRouter.put("/cancel/:id",        cancelOrder);
ordersRouter.delete("/delete/:id",     deleteOrder);

export default ordersRouter;
