import express from "express";
const router = express.Router();
import lecturerController from "../controllers/lecturerController.js";
import verifyJwt from "../middleware/verifyJwt.js";

router.use(verifyJwt);
router
  .route("/")
  .get(lecturerController.getAllLecturers)
  .post(lecturerController.createNewLecturer)
  .patch(lecturerController.updateLecturer)
  .delete(lecturerController.deleteLecturer);
  

router
.route("/lecturer/:lecturerId")
.get(lecturerController.getLecturerById)

router
  .route("/addUniversityCode/:id")
  .patch(lecturerController.updateCode);
export default router;
