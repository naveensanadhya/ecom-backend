import express from "express";
import { login, register } from "../controllers/authController.js";
import { validateRequest } from "../middlewares/validate.js";
import { loginSchema, registerSchema } from "../validators/userValidator.js";

const router = express.Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);

export default router;
