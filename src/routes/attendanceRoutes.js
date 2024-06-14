import express from 'express';
import attendanceController from '../controllers/attendanceController.js';

const router = express.Router();

router.route('/')
    .get(attendanceController.getAllAttendances)
    .post(attendanceController.createNewAttendance)
    .patch(attendanceController.updateAttendance)
    .delete(attendanceController.deleteAttendance);

export default router;