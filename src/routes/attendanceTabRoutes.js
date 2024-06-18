import express from "express";
const router = express.Router();
import attendanceTabController from "../controllers/attendanceTabController.js";
import verifyJwt from "../middleware/verifyJwt.js";

//router.use(verifyJwt);
router
  .route("/")
  .get(attendanceTabController.getAllAttendanceTabs)
  .post(attendanceTabController.createNewAttendanceTab)
  .patch(attendanceTabController.updateAttendancesTab)
  .delete(attendanceTabController.deleteAttendanceTab);

  router
  .route("/student")
  .patch(attendanceTabController.updateAttendanceTab)

  router
  .route("/student/:studentId")
  .get(attendanceTabController.getAttendanceTabByStudentId);

  router
  .route("/:lecturerId")
  .get(attendanceTabController.getAttendanceTabById);

  router
  .route('/toggleOpen')
  .patch(attendanceTabController.toggleOpenAttendanceTab)
export default router;
