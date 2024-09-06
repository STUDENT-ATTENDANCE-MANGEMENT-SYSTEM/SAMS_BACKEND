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

  router
  .route('/:lecturerId/insight/getNoOfAttendance')
  .post(attendanceTabController.getNoOfAttendance)

  router
  .route('/:lecturerId/insight/getStudentsArray')
  .post(attendanceTabController.getStudentsArray)

  router
  .route('/:lecturerId/insight/getAverageNumberOfStudents')
  .post(attendanceTabController.getAverageNumberOfStudents)

  
  router
  .route('/:lecturerId/insight/getStudentsArrayLength')
  .post(attendanceTabController.getStudentsArrayLength)
  
export default router;

