import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  matricNumber: {
    type: String,
  },
  department: {
    type: String,
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
});

const attendanceSchema = new mongoose.Schema(
  {
    lecturerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecturer",
    },
    attendanceTabId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AttendanceTab"
    },
    students: [studentSchema],
  },
  { timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

attendanceSchema.virtual('present').get(function() {
  return this.students.length;
});
export default mongoose.model("Attendance", attendanceSchema);