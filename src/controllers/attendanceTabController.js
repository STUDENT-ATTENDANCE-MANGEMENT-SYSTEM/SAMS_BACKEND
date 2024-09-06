import AttendanceTab from "../models/AttendanceTab.js";
import Lecturer from "../models/Lecturer.js";
import asyncHandler from "express-async-handler";
import { customAlphabet } from "nanoid";
import Attendance from "../models/Attendance.js";
import mongoose from "mongoose";
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

  const attendanceTabsWithLecturer = await Promise.all(
    attendanceTabs.map(async (attendanceTab) => {
      const lecturer = await Lecturer.findById(attendanceTab.lecturerId)
        .lean()
        .exec();
      return { ...attendanceTab, lecturerName: lecturer.prefix + '' + lecturer.lastname };
    })
  );

  res.json(attendanceTabsWithLecturer);
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

const updateAttendanceTabLocation = async (req, res) => {
  const { lecturerID, attendanceTabID, location } = req.body;

  if (!lecturerID || !attendanceTabID) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const attendanceTab = await AttendanceTab.findOne({
      _id: attendanceTabID,
      // Assuming there's a way to validate the lecturerID here
    });

    if (!attendanceTab) {
      return res.status(404).json({ message: "AttendanceTab not found" });
    }

    // Check if both longitude and latitude are provided
    if (location && location.longitude !== undefined && location.latitude !== undefined) {
      attendanceTab.location = location;
    } else {
      // Optionally handle the case where location data is incomplete or not provided
      console.log("Incomplete location data. Skipping location update.");
    }

    await attendanceTab.save();
    res.json({ message: "AttendanceTab updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update AttendanceTab" });
  }
};
const getNoOfAttendance = asyncHandler(async (req, res) => {
  const { lecturerId} = req.params;
  const {attendanceTabId } = req.body;
  if (!mongoose.Types.ObjectId.isValid(lecturerId) || !mongoose.Types.ObjectId.isValid(attendanceTabId)) {
    return res.status(400).json({ message: "Invalid lecturerId or attendanceTabId" });
  }

  if (!lecturerId || !attendanceTabId) {
    return res.status(400).json({ message: "Both lecturerId and attendanceTabId are required" });
  }

  // Query the database for the specific attendanceTab
  const attendanceTab = await AttendanceTab.findOne({
    _id: attendanceTabId,
    lecturerId: lecturerId,
  });

  if (!attendanceTab) {
    return res.status(404).json({ message: "Attendance tab not found" });
  }

  // Assuming 'noOfAttendance' is a field in your attendanceTab document
  const noOfAttendance = attendanceTab.noOfAttendance;

  // Send the noOfAttendance in the response
  res.json({ noOfAttendance });
});


const getAverageNumberOfStudents = asyncHandler(async (req, res) => {
  const { lecturerId} = req.params;
  const {attendanceTabId } = req.body;

  // Confirm data
  if (!lecturerId || !attendanceTabId) {
    return res.status(400).json({ message: "Both lecturerId and attendanceTabId are required" });
  }
  if (!mongoose.Types.ObjectId.isValid(lecturerId) || !mongoose.Types.ObjectId.isValid(attendanceTabId)) {
    return res.status(400).json({ message: "Invalid lecturerId or attendanceTabId" });
  }
  // Query the database for attendances created by the lecturer and for the specific tab
  const attendances = await Attendance.find({
    lecturerId: lecturerId,
    attendanceTabId: attendanceTabId,
  });

  if (!attendances.length) {
    return res.status(404).json({ message: "No attendances found for the given criteria" });
  }

  // Calculate the average number of students
  let totalStudents = 0;
  attendances.forEach(attendance => {
    totalStudents += attendance.students.length; // Assuming 'students' is an array
  });
  const averageNumberOfStudents = totalStudents / attendances.length;

  // Send the average number of students in the response
  res.json({ averageNumberOfStudents });
});

const getStudentsArrayLength = asyncHandler(async (req, res) => {
  const { lecturerId} = req.params;
  const {attendanceTabId } = req.body;

  // Confirm data
  if (!lecturerId || !attendanceTabId) {
    return res.status(400).json({ message: "Both lecturerId and attendanceTabId are required" });
  }
  if (!mongoose.Types.ObjectId.isValid(lecturerId) || !mongoose.Types.ObjectId.isValid(attendanceTabId)) {
    return res.status(400).json({ message: "Invalid lecturerId or attendanceTabId" });
  }

  const attendances = await Attendance.find({
    lecturerId: lecturerId,
    attendanceTabId: attendanceTabId,
  });

  if (!attendances.length) {
    return res.status(404).json({ message: "No attendances found for the given criteria" });
  }

  const studentsArrayLengths = attendances.map(attendance => attendance.students.length);

  res.json({ studentsArrayLengths });
});


const getStudentsArray = async (req, res) => {
  try {
    const { lecturerId} = req.params;
  const {attendanceTabId } = req.body;

  // Confirm data
  if (!lecturerId || !attendanceTabId) {
    return res.status(400).json({ message: "Both lecturerId and attendanceTabId are required" });
  }
  if (!mongoose.Types.ObjectId.isValid(lecturerId) || !mongoose.Types.ObjectId.isValid(attendanceTabId)) {
    return res.status(400).json({ message: "Invalid lecturerId or attendanceTabId" });
  }

    // Assuming you have a model named AttendanceTab that refers to your attendance tabs
    const attendanceTab = await AttendanceTab.findOne({
      lecturerId: lecturerId,
      _id: attendanceTabId,
    });

    if (!attendanceTab) {
      return res.status(404).send({ message: "Attendance tab not found" });
    }

    const studentsArrayLength = attendanceTab.students.length;

    res.json({ studentsArrayLength });
  } catch (error) {
    console.error("Error retrieving students array length:", error);
    res.status(500).send({ message: "Failed to retrieve students array length" });
  }
};


const getWeeklyStudentsArrayLength = asyncHandler(async (req, res) => {
  const { lecturerId} = req.params;
  const {attendanceTabId } = req.body;

  // Confirm data
  if (!lecturerId || !attendanceTabId) {
    return res.status(400).json({ message: "Both lecturerId and attendanceTabId are required" });
  }
  if (!mongoose.Types.ObjectId.isValid(lecturerId) || !mongoose.Types.ObjectId.isValid(attendanceTabId)) {
    return res.status(400).json({ message: "Invalid lecturerId or attendanceTabId" });
  }
  
  const now = new Date();
  const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const lastDayOfWeek = new Date(now.setDate(firstDayOfWeek.getDate() + 6));

  

  const weeklyAttendances = await Attendance.find({
    lecturerId: lecturerId,
    attendanceTabId: attendanceTabId,
    createdAt: { $gte: firstDayOfWeek, $lte: lastDayOfWeek }
  });

  if (!weeklyAttendances.length) {
    return res.status(404).json({ message: "No attendances found for the given criteria" });
  }

  const studentsArrayLengths = weeklyAttendances.map(attendance => attendance.students.length);

  res.json({ studentsArrayLengths });
});

const getMonthlyStudentsArrayLength = asyncHandler(async (req, res) => {
  const { lecturerId} = req.params;
  const {attendanceTabId } = req.body;

  // Confirm data
  if (!lecturerId || !attendanceTabId) {
    return res.status(400).json({ message: "Both lecturerId and attendanceTabId are required" });
  }
  if (!mongoose.Types.ObjectId.isValid(lecturerId) || !mongoose.Types.ObjectId.isValid(attendanceTabId)) {
    return res.status(400).json({ message: "Invalid lecturerId or attendanceTabId" });
  }
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  

  const monthlyAttendances = await Attendance.find({
    lecturerId: lecturerId,
    attendanceTabId: attendanceTabId,
    createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }
  });

  if (!monthlyAttendances.length) {
    return res.status(404).json({ message: "No attendances found for the given criteria" });
  }

  const studentsArrayLengths = monthlyAttendances.map(attendance => attendance.students.length);

  res.json({ studentsArrayLengths });
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
  getNoOfAttendance,
  getAverageNumberOfStudents,
  getStudentsArrayLength,
  getStudentsArray,
  getWeeklyStudentsArrayLength,
  getMonthlyStudentsArrayLength,
  updateAttendanceTabLocation,
};
