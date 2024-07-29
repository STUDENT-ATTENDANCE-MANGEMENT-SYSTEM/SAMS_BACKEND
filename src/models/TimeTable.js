import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema({
  lecturerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lecturer",
  },
  classes:[{
    subject: String,
    day: String,
    startTime: String,
    endTime: String,
    location: String,
  }]
  
});

export default mongoose.model("Timetable", timetableSchema)
