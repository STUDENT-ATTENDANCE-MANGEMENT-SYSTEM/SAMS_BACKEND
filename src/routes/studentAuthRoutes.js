import express from "express";
const router = express.Router();
import studentAuthController from "../controllers/auth/studentAuthController.js";
import loginLimiter from "../middleware/loginLimiter.js";



router.route("/signup").post(studentAuthController.signup);
router.route("/login").post(loginLimiter, studentAuthController.login);


router.route("/refresh").get(studentAuthController.refresh);

router.route("/logout").post(studentAuthController.logout);

export default router;
