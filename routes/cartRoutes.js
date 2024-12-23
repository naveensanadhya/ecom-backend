import express from "express";
import { protect } from "../middlewares/authenticationMiddleware.js";
import {
  addToCart,
  clearCart,
  getCart,
  getCartCount,
  removeFromCart,
} from "../controllers/cartController.js";
import { validateRequest } from "../middlewares/validate.js";
import {
  addToCartSchema,
  removeFromCartSchema,
} from "../validators/cartValidator.js";

const router = express.Router();
router.post("/add", validateRequest(addToCartSchema), addToCart);
router.post("/remove", validateRequest(removeFromCartSchema), removeFromCart);
router.get("/", getCart);
router.get("/count", getCartCount);
router.post("/clear", protect, clearCart);

export default router;
