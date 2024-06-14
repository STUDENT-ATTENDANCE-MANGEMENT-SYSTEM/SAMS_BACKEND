import AttendanceTab from "../models/AttendanceTab.js";
import Lecturer from "../models/Lecturer.js";
import asyncHandler from "express-async-handler";
import { customAlphabet } from "nanoid";
import Student from "../models/Student.js";
const nanoid = customAlphabet("abcde123456789", 5);

const getAllAttendanceTabs = asyncHandler(async (req, res) => {
  // Get all attendanceTabs from MongoDB
  const attendanceTabs = await AttendanceTab.find().lean();

  // If no attendanceTabs
  if (!attendanceTabs?.length) {
    return res.status(400).json({ message: "No attendanceTab found" });
  }

  const attendanceTabsWithLecturer = await Promise.all(
    attendanceTabs.map(async (attendanceTab) => {
      const lecturer = await Lecturer.findById(attendanceTab.lecturerId)
        .lean()
        .exec();
      return { ...attendanceTab, lecturerName: lecturer.lastname };
    })
  );

  res.json(attendanceTabsWithLecturer);
});

const getAttendanceTabById = asyncHandler(async (req, res) => {
  const lecturerId = req.params.lecturerId;

  // Find the attendanceTabs with the given lecturer ID
  const attendanceTabs = await AttendanceTab.find({
    lecturerId: lecturerId,
  }).lean();

  // If no attendanceTab was found
  if (!attendanceTabs.length) {
    return res
      .status(404)
      .json({ message: "No attendanceTabs found for this lecturer ID" });
  }

  res.json(attendanceTabs);
});

const getAttendanceTabByStudentId = asyncHandler(async (req, res) => {
  const studentId = req.params.studentId;

  // Find the attendanceTabs with the given student ID
  const attendanceTabs = await AttendanceTab.find({
    students: { $elemMatch: { student: studentId } },
  }).lean();

  // If no attendanceTab was found
  if (!attendanceTabs.length) {
    return res
      .status(404)
      .json({ message: "No attendanceTabs found for this student ID" });
  }

  res.json(attendanceTabs);
});
const createNewAttendanceTab = asyncHandler(async (req, res) => {
  const { lecturerId, courseCode, courseName } = req.body;

  // Confirm data
  if (!lecturerId || !courseCode || !courseName) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingAttendanceTab = await AttendanceTab.findOne({
    lecturerId,
    courseCode,
  });

  if (existingAttendanceTab) {
    return res.status(400).json({ message: "Attendance tab already exist" });
  }

  let attendanceCode;
  let existingCode;

  do {
    attendanceCode = nanoid();
    existingCode = await AttendanceTab.findOne({ attendanceCode });
  } while (existingCode);
  // Create and store the new lecturer
  const attendanceTab = await AttendanceTab.create({
    lecturerId,
    courseCode,
    courseName,
    attendanceCode,
  });

  if (attendanceTab) {
    // Created

    return res.status(201).json({
      attendanceTab,
      message: "New attendance tab created",
    });
  } else {
    return res
      .status(400)
      .json({ message: "Invalid attendance tab data received" });
  }
});

const updateAttendancesTab = asyncHandler(async (req, res) => {
  const { id, lecturerId, courseCode, courseName, open } = req.body;

  // Confirm data
  if (
    !id ||
    !lecturerId ||
    !courseCode ||
    !courseName ||
    typeof open !== "boolean"
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Confirm attendanceTab exists to update
  const attendanceTab = await AttendanceTab.findById(id).exec();

  if (!attendanceTab) {
    return res.status(400).json({ message: "AttendanceTab not found" });
  }

  attendanceTab.lecturerId = lecturerId;
  attendanceTab.courseCode = courseCode;
  attendanceTab.courseName = courseName;
  const updatedAttendanceTab = await attendanceTab.save();

  res.json(`'${updatedAttendanceTab.courseCode}' updated`);
});

const updateAttendanceTab = asyncHandler(async (req, res) => {
  const { id, attendanceCode } = req.body;

  // Confirm data
  if (!id || !attendanceCode) {
    return res
      .status(400)
      .json({ message: "Both ID and attendanceCode are required" });
  }

  // Find the attendanceTab with the given attendance
  const attendanceTab = await AttendanceTab.findOne({ attendanceCode });

  // If no attendanceTab was found
  if (!attendanceTab) {
    return res
      .status(404)
      .json({ message: "No attendanceTab found with this attendanceCode" });
  }

  // Add the student ID to the students array
  attendanceTab.students.push({ student: id });

  // Save the updated attendanceTab
  const updatedAttendanceTab = await attendanceTab.save();

  res.json(updatedAttendanceTab);
});

const toggleOpenAttendanceTab = async (req, res) => {
  try {
    const { id } = req.body;

    // Confirm data
    if (!id) {
      return res.status(400).json({ message: "AttendanceTab ID required" });
    }
  
    // Confirm attendanceTab exists to delete
    const attendanceTab = await AttendanceTab.findById(id).exec();
  
    if (!attendanceTab) {
      return res.status(400).json({ message: "AttendanceTab not found" });
    }

    attendanceTab.Open = !attendanceTab.Open;
    await attendanceTab.save();

    res.json(attendanceTab);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteAttendanceTab = asyncHandler(async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "AttendanceTab ID required" });
  }

  // Confirm attendanceTab exists to delete
  const attendanceTab = await AttendanceTab.findById(id).exec();

  if (!attendanceTab) {
    return res.status(400).json({ message: "AttendanceTab not found" });
  }

  const result = await attendanceTab.deleteOne();

  const reply = `AttendanceTab with ID ${result._id} deleted`;

  res.json(reply);
});

export default {
  getAllAttendanceTabs,
  createNewAttendanceTab,
  updateAttendanceTab,
  deleteAttendanceTab,
  getAttendanceTabById,
  updateAttendancesTab,
  toggleOpenAttendanceTab,
  getAttendanceTabByStudentId,
};
