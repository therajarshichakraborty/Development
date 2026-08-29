import { Router } from "express";
import { authController } from "../controller/auth.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { validate } from "../validator/auth.validator.js";
import { registerSchema, loginSchema } from "../validator/auth.validator.js";

const router: Router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.get("/me", authMiddleware, authController.getMe);

export default router;
