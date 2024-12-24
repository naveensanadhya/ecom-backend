import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../controllers/productController.js";
import { protect } from "../middlewares/authenticationMiddleware.js";
import { validateRequest } from "../middlewares/validate.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../validators/productValidator.js";

const router = express.Router();
router.post("/", protect, validateRequest(createProductSchema), createProduct);
router.put(
  "/:id",
  protect,
  validateRequest(updateProductSchema),
  updateProduct
);
router.delete("/:id", protect, deleteProduct);
router.get("/", getAllProducts);

export default router;
