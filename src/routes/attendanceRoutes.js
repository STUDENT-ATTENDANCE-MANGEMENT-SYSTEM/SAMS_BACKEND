const express = require('express')
const router = express.Router()
const attendanceController = require('../controllers/attendanceController')

router.route('/')
    .get(attendanceController.getAllAttendances)
    .post(attendanceController.createNewAttendance)
    .patch(attendanceController.updateAttendance)
    .delete(attendanceController.deleteAttendance)

module.exports = router