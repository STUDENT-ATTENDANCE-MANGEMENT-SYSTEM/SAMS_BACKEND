import mongoose from "mongoose";

const attendanceTabSchema = new mongoose.Schema(
  {
    lecturerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecturer"
    },
    courseCode: {
      type: String,
      required: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    attendanceCode: {
      type: String
    },
    Open: {
      type: Boolean,
      default: false,
    },
    location: {
      longitude: {
        type: Number,
      },
      latitude: {
        type: Number,
      },
    },
    students: [
      {
        _id: false,
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
        }
      },
    ],
    attendanceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attendance"
    },
    noOfAttendance:{
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("AttendanceTab", attendanceTabSchema);