import express from "express";
const router = express.Router();
import lecturerAuthController from "../controllers/auth/lecturerAuthController.js";
import loginLimiter from "../middleware/loginLimiter.js";


router.route("/signup").post(lecturerAuthController.signup);
router.route("/login").post(loginLimiter, lecturerAuthController.login);

router.route("/refresh").get(lecturerAuthController.refresh);

router.route("/logout").post(lecturerAuthController.logout);

export default router;
