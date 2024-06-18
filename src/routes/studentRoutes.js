import  express from "express";
const router = express.Router();
import studentController from "../controllers/studentController.js";
import verifyJwt from "../middleware/verifyJwt.js";

//router.use(verifyJwt);
router
  .route("/")
  .get(studentController.getAllStudents)
  .post(studentController.createNewStudent)
  .patch(studentController.updateStudent)
  .delete(studentController.deleteStudent)
  

  router
  .route("/student/:id")
  .get(studentController.getStudentById)  
router
  .route("/addPin/:id")
  .patch(studentController.updatePin);

  router
  .route("/verify-pin")
  .post(studentController.checkUserPinExists);
export default router;
