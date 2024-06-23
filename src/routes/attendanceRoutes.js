import express from 'express';
import attendanceController from '../controllers/attendanceController.js';

const router = express.Router();

router.route('/')
    .post(attendanceController.createAttendance)
    .patch(attendanceController.updateAttendance)
    .delete(attendanceController.deleteAttendance)

    

    router.route('/student')
    .patch(attendanceController.updateStudentAttendance)
    .delete(attendanceController.deleteStudentFromAttendance)
    .post(attendanceController.calculateAttendancePercentage)
    
    router.route('/:id')
    .get(attendanceController.getSingleAttendanceById)

    router.route('/:attendanceTabId/:lecturerId')
    .get(attendanceController.getAllAttendances)


export default router;