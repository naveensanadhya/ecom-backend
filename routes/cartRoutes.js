import express from "express";
import {
  addToCart,
  checkoutCart,
  getCart,
  getCartCount,
  removeFromCart,
  updateQuantity,
} from "../controllers/cartController.js";
import { validateRequest } from "../middlewares/validate.js";
import {
  addToCartSchema,
  removeFromCartSchema,
  updateCartSchema,
} from "../validators/cartValidator.js";

const router = express.Router();
router.post("/add", validateRequest(addToCartSchema), addToCart);
router.post("/remove", validateRequest(removeFromCartSchema), removeFromCart);
router.get("/", getCart);
router.get("/count", getCartCount);
router.put("/items", validateRequest(updateCartSchema), updateQuantity);
router.post("/checkout", checkoutCart);

export default router;
