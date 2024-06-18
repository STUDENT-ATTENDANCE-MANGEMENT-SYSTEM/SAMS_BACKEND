import Attendance from "../models/Attendance.js";
import AttendanceTab from "../models/AttendanceTab.js";
import asyncHandler from "express-async-handler";

// @desc Get all attendances
// @route GET /attendances
// @access Private
const getAllAttendances = asyncHandler(async (req, res) => {
   // Assuming you're passing these as query parameters
  try {
    const { attendanceTabId, lecturerId } = req.params;
    if (!attendanceTabId || !lecturerId) {
      return res.status(400).send({ message: 'attendanceTabId and lecturerId are required' });
    }

    // Query the database for attendance records matching the criteria
    const attendanceRecords = await Attendance.find({
      attendanceTabId: attendanceTabId,
      lecturerId: lecturerId
    });

    // Send the found attendance records as a response
    res.status(200).json(attendanceRecords);
  } catch (error) {
    // Handle possible errors
    console.error('Error fetching attendance records:', error);
    res.status(500).send({ message: 'Error fetching attendance records' });
  }
});

const getSingleAttendanceById = async (req, res) => {
  try {
    const { id } = req.params; // Extract the _id from request parameters

    // Validate input
    if (!id) {
      return res.status(400).json({ message: "Attendance ID is required" });
    }

    // Find the attendance document by its _id
    const attendance = await Attendance.findById(id);

    // If no attendance found, return a 404
    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    // Return the found attendance document
    res.status(200).json(attendance);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ message: "Error fetching attendance" });
  }
};

const createAttendance = asyncHandler(async (req, res) => {
  const { lecturerId, attendanceTabId } = req.body;
  try {
    // Step 1: Create a new Attendance record
    const newAttendance = await Attendance.create({ lecturerId, attendanceTabId });

    // Step 2: MongoDB automatically generates an _id, which we use as attendanceId
    const attendanceId = newAttendance._id;

    // Step 3: Update the AttendanceTab document with the new attendanceId
    await AttendanceTab.findOneAndUpdate(
      { _id: attendanceTabId }, // Find by attendanceTabId
      { attendanceId: attendanceId }, // Set the new attendanceId
      { new: true } // Return the updated document
    );

    res.status(201).send({ message: 'Attendance created and AttendanceTab updated', attendanceId });
  } catch (error) {
    console.error('Error creating attendance:', error);
    res.status(500).send({ message: 'Failed to create attendance' });
  }
})

const updateStudentAttendance = asyncHandler(async (req, res) => {
  const { attendanceId, lecturerId, name, department, matricNumber } = req.body;

  // Confirm data
  if (!attendanceId || !lecturerId || !name || !department || !matricNumber) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Confirm attendance exists to update
  const attendance = await Attendance.findById(attendanceId).exec();

  if (!attendance) {
    return res.status(400).json({ message: "Attendance not found" });
  }

  if (attendance.lecturerId.toString() !== lecturerId) {
    return res.status(403).json({ message: "Unauthorized: You are not allowed to update this attendance" });
  }

  // Find the student in the students array

    attendance.students.name = name;
    attendance.students.department = department;
    attendance.students.matricNumber = matricNumber;
  
    // Add a new student to the array
    attendance.students.push({ name, department, matricNumber });
  

  // Save the updated attendance document
  await attendance.save();

  res.status(200).json({ message: "Attendance updated successfully", attendance });
});

const updateAttendance = asyncHandler(async (req, res) => {
  const { attendanceId, studentId, name, department, matricNumber } = req.body;

  // Confirm data
  if (!attendanceId || !studentId || !name || !department || !matricNumber) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Confirm attendance exists to update
  const attendance = await Attendance.findById(attendanceId).exec();

  if (!attendance) {
    return res.status(400).json({ message: "Attendance not found" });
  }

  // Find the student in the students array
  const studentIndex = attendance.students.findIndex(student => student.studentId === studentId);

  if (studentIndex !== -1) {
    // Update existing student's details
    attendance.students[studentIndex].name = name;
    attendance.students[studentIndex].department = department;
    attendance.students[studentIndex].matricNumber = matricNumber;
  } else {
    // Add a new student to the array
    attendance.students.push({ studentId, name, department, matricNumber });
  }

  // Save the updated attendance document
  await attendance.save();

  res.status(200).json({ message: "Attendance updated successfully", attendance });
});

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

const deleteStudentFromAttendance = asyncHandler(async (req, res) => {
  const { attendanceId, studentId } = req.body;

  // Confirm both attendanceId and studentId are provided
  if (!attendanceId || !studentId) {
    return res.status(400).json({ message: "Attendance ID and Student ID are required" });
  }

  // Find the attendance document
  const attendance = await Attendance.findById(attendanceId);

  if (!attendance) {
    return res.status(404).json({ message: "Attendance not found" });
  }

  // Find the index of the student in the students array
  const studentIndex = attendance.students.findIndex(student => student._id.toString() === studentId);

  // If student exists, remove them
  if (studentIndex !== -1) {
    attendance.students.splice(studentIndex, 1);
    await attendance.save(); // Save the updated document
    return res.status(200).json({ message: "Student removed successfully" });
  } else {
    return res.status(404).json({ message: "Student not found in attendance" });
  }
});

export default {
  getAllAttendances,
  getSingleAttendanceById,
  updateAttendance,
  updateStudentAttendance,
  deleteAttendance,
  createAttendance,
  deleteStudentFromAttendance
};
