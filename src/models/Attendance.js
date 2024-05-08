const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    matricNumber: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const attendanceSchema = new mongoose.Schema(
  {
    lecturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecturer",
      required: true,
    },
    courseCode: {
      type: String,
      required: true,
      unique: true,
    },
    courseName: {
      type: String,
      required: true,
      unique: true,
    },
    students: [studentSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
