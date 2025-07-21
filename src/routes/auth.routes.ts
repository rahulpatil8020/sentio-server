import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { validateRequest } from "../middleware/validateRequest";
import { SignupSchema, LoginSchema } from "../schemas/auth.schema";
import { asyncHandler } from "../utils/asyncHandler";
const router = Router();

router.post(
  "/signup",
  validateRequest(SignupSchema),
  asyncHandler(authController.signup)
);
router.post(
  "/login",
  validateRequest(LoginSchema),
  asyncHandler(authController.login)
);
router.get("/refresh-token", asyncHandler(authController.refreshToken));
router.post("/logout", asyncHandler(authController.logout));

export default router;
