import Timetable from "../models/TimeTable.js";
import StudentTimeTable from "../models/StudentTimeTable.js";
import mongoose from "mongoose";

const createLecturerTimeTable = async (req, res) => {
  try {
    // Extract user ID from the request body
    const { lecturerId } = req.params;

    // Create a new timetable instance with the user ID and an empty classes array
    const newTimetable = new Timetable({
      lecturerId: lecturerId,
      classes: [], // Leave the classes array empty
    });

    // Save the new timetable to the database
    await newTimetable.save();

    // Send a success response
    res
      .status(201)
      .json({ message: "Timetable created successfully", newTimetable });
  } catch (error) {
    // Send an error response
    res
      .status(500)
      .json({ message: "Failed to create timetable", error: error.message });
  }
};

const createStudentTimeTable = async (req, res) => {
  try {
    // Extract user ID from the request body
    const { studentId } = req.params;

    // Create a new timetable instance with the user ID and an empty classes array
    const newTimetable = new StudentTimeTable({
      studentId,
      classes: [], // Leave the classes array empty
    });

    // Save the new timetable to the database
    await newTimetable.save();

    // Send a success response
    res
      .status(201)
      .json({ message: "Timetable created successfully", newTimetable });
  } catch (error) {
    // Send an error response
    res
      .status(500)
      .json({ message: "Failed to create timetable", error: error.message });
  }
};

const addStudentTimeTable = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    const timetable = await StudentTimeTable.findOne({ studentId });

    if (!timetable) {
      console.log("Timetable not found");

      return res.status(404).json({ message: "Timetable not found" });
    }

    const { subject, day, startTime, endTime, location} = req.body;

    timetable.classes.push({ subject, day, startTime, endTime, location});

    const savedTimetable = await timetable.save();

    res.status(201).json(savedTimetable);
  } catch (error) {
    console.error("Error creating timetable:", error);
    res.status(500).json({ message: "Failed to create timetable" });
  }
};

const addLecturerTimeTable = async (req, res) => {
  try {
    const lecturerId = req.params.lecturerId;

    const timetable = await Timetable.findOne({ lecturerId });

    if (!timetable) {
      console.log("Timetable not found");

      return res.status(404).json({ message: "Timetable not found" });
    }

    const { subject, day, startTime, endTime, location } = req.body;

    timetable.classes.push({ subject, day, startTime, endTime, location });

    const savedTimetable = await timetable.save();

    res.status(201).json(savedTimetable);
  } catch (error) {
    console.error("Error creating timetable:", error);
    res.status(500).json({ message: "Failed to create timetable" });
  }
};

const getLecturerTimeTableById = async (req, res) => {
  try {
    // Extract timetable ID from request parameters
    const lecturerId = req.params.lecturerId;

    if (
      !lecturerId ||
      typeof lecturerId !== "string" ||
      lecturerId.trim() === ""
    ) {
      return res.status(400).json({ message: "Invalid lecturer ID" });
    }

    // Find the timetable in the database
    const timetable = await Timetable.findOne({ lecturerId });

    if (!timetable) {
      return res.status(404).json({ message: "Timetable not found" });
    }

    // Send the found timetable as a response
    res.status(200).json(timetable);
  } catch (error) {
    // Handle errors
    console.error("Error fetching timetable:", error);
    res.status(500).json({ message: "Failed to fetch timetable" });
  }
};

const getStudentTimeTableById = async (req, res) => {
  try {
    // Extract timetable ID from request parameters
    const studentId = req.params.studentId;

    // Find the timetable in the database
    const timetable = await StudentTimeTable.findOne({ studentId });

    if (!timetable) {
      // If the timetable doesn't exist, send a 404 response
      return res.status(404).json({ message: "Timetable not found" });
    }

    // Send the found timetable as a response
    res.status(200).json(timetable);
  } catch (error) {
    // Handle errors
    console.error("Error fetching timetable:", error);
    res.status(500).json({ message: "Failed to fetch timetable" });
  }
};

const deleteLecturerTimeTable = async (req, res) => {
  try {
    const { lecturerId } = req.params;

    // Check if the timetable exists
    const timetable = await Timetable.findOne({ lecturerId });
    if (!timetable) {
      return res.status(404).json({ message: "Timetable not found" });
    }

    // Delete the timetable
    await Timetable.deleteOne({ lecturerId });

    // Send a success response
    res.status(200).json({ message: "Timetable deleted successfully" });
  } catch (error) {
    // Send an error response
    res
      .status(500)
      .json({ message: "Failed to delete timetable", error: error.message });
  }
};

const deleteStudentTimeTable = async (req, res) => {
  try {
    const { lecturerId } = req.params;

    // Check if the timetable exists
    const timetable = await StudentTimeTable.findOne({ studentId });
    if (!timetable) {
      return res.status(404).json({ message: "Timetable not found" });
    }

    // Delete the timetable
    await StudentTimeTable.deleteOne({ studentId });

    // Send a success response
    res.status(200).json({ message: "Timetable deleted successfully" });
  } catch (error) {
    // Send an error response
    res
      .status(500)
      .json({ message: "Failed to delete timetable", error: error.message });
  }
};

export default {
  createStudentTimeTable,
  createLecturerTimeTable,
  addLecturerTimeTable,
  addStudentTimeTable,
  getLecturerTimeTableById,
  getStudentTimeTableById,
  deleteLecturerTimeTable,
  deleteStudentTimeTable,
};
