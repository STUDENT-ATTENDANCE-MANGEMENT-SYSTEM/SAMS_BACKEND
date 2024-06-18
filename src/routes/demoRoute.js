import express from "express";
const router = express.Router();
import demoController from "../controllers/demoController.js";



router.route("/").post(demoController.createDemo);

export default router;