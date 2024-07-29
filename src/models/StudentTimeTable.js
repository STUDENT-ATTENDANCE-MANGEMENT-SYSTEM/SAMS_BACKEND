import mongoose from "mongoose";

const studenttimetableSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  classes:[{
    subject: String,
    day: String,
    startTime: String,
    endTime: String,
    location: String
  }]
  
});

export default mongoose.model("StudentTimetable", studenttimetableSchema)
