const express = require("express");
const router = express.Router();
const lecturerController = require("../controllers/lecturerController");

router
  .route("/")
  .get(lecturerController.getAllLecturers)
  .post(lecturerController.createNewLecturer)
  .patch(lecturerController.updateLecturer)
  .delete(lecturerController.deleteLecturer);

module.exports = router;
