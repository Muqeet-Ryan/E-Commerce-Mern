import express from "express";
import {
  addToCart,
  deleteCart,
  getCartProducts,
  updateCartQuantity,
} from "../controllers/cart.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getCartProducts);
router.post("/", protectRoute, addToCart);
router.delete("/", protectRoute, deleteCart);
router.put("/:id", protectRoute, updateCartQuantity);

export default router;
