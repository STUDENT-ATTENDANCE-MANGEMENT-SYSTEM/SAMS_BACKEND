import express from "express";
const router = express.Router();

import timeTableController from "../controllers/timeTableController.js";

router
  .route("/:studentId/student")
  .post(timeTableController.createStudentTimeTable)

router
  .route("/:lecturerId")
  .post(timeTableController.createLecturerTimeTable)

router
  .route("/:studentId/add/student")
  .post(timeTableController.addStudentTimeTable)
  
  
router
  .route("/:studentId/student")
  .get(timeTableController.getStudentTimeTableById)
 
router
  .route("/:lecturerId")
  .get(timeTableController.getLecturerTimeTableById)  

router
  .route("/:lecturerId/add")
  .post(timeTableController.addLecturerTimeTable)

router
  .route("/:lecturerId")
  .delete(timeTableController.deleteLecturerTimeTable)

router
  .route("/:studentId/student")
  .delete(timeTableController.deleteStudentTimeTable)
export default router;
