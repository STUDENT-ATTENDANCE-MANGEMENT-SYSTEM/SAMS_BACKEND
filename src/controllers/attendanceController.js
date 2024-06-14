import Attendance from "../models/Attendance.js";
import Lecturer from "../models/Lecturer.js";
import asyncHandler from "express-async-handler";

// @desc Get all attendances
// @route GET /attendances
// @access Private
const getAllAttendances = asyncHandler(async (req, res) => {
  // Get all attendances from MongoDB
  const attendances = await Attendance.find().lean();

  // If no attendances
  if (!attendances?.length) {
    return res.status(400).json({ message: "No attendances found" });
  }

  // Add lecturername to each attendance before sending the response
  // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE
  // You could also do this with a for...of loop
  const attendancesWithLecturer = await Promise.all(
    attendances.map(async (attendance) => {
      const lecturer = await Lecturer.findById(attendance.lecturer)
        .lean()
        .exec();
      return { ...attendance, lecturerName: lecturer.lastname };
    })
  );

  res.json(attendancesWithLecturer);
});

// @desc Create new attendance
// @route POST /attendances
// @access Private
const createNewAttendance = asyncHandler(async (req, res) => {
  const { lecturer, courseCode, courseName } = req.body;

  // Confirm data
  if (!lecturer || !courseCode || !courseName) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for duplicate courseCode
 //

  // Create and store the new lecturer
  const attendance = await Attendance.create({
    lecturer,
    courseCode,
    courseName,
  });

  if (attendance) {
    // Created
    return res.status(201).json({ message: "New attendance created" });
  } else {
    return res
      .status(400)
      .json({ message: "Invalid attendance data received" });
  }
});

// @desc Update a attendance
// @route PATCH /attendances
// @access Private
const updateAttendance = asyncHandler(async (req, res) => {
  const { id, lecturer, courseCode, courseName, students } = req.body;

  // Confirm data
  if (!id || !lecturer || !courseCode || !courseName || !students) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Confirm attendance exists to update
  const attendance = await Attendance.findById(id).exec();

  if (!attendance) {
    return res.status(400).json({ message: "Attendance not found" });
  }


  attendance.lecturer = lecturer;
  attendance.courseCode = courseCode;
  attendance.courseName = courseName;
  attendance.students = students;
  
  const updatedAttendance = await attendance.save();

  res.json(`'${updatedAttendance.courseCode}' updated`);
});

// @desc Delete a attendance
// @route DELETE /attendances
// @access Private
const deleteAttendance = asyncHandler(async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "Attendance ID required" });
  }

  // Confirm attendance exists to delete
  const attendance = await Attendance.findById(id).exec();

  if (!attendance) {
    return res.status(400).json({ message: "Attendance not found" });
  }

  const result = await attendance.deleteOne();

  const reply = `Attendance with ID ${result._id} deleted`;

  res.json(reply);
});

export default {
  getAllAttendances,
  createNewAttendance,
  updateAttendance,
  deleteAttendance,
};
