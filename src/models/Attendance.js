import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  matricNumber: {
    type: String,
    unique: true,
  },
  department: {
    type: String,
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
});

const attendanceSchema = new mongoose.Schema(
  {
    lecturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecturer",
    },
    attendance: {
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