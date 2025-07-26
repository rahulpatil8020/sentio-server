import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { validateRequest } from "../middleware/validateRequest";
import { SignupSchema, LoginSchema } from "../schemas/auth.schema";
import { asyncHandler } from "../utils/asyncHandler";
import { verifyToken } from "../middleware/verifyToken";
const router = Router();

router.use(verifyToken);

router.post(
    "/onboard",
    asyncHandler(userController.onboardUser)
);
// router.post(
//   "/",
//   validateRequest(LoginSchema),
//   asyncHandler(authController.login)
// );
export default router;
