import mongoose from "mongoose";

const lecturerSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  pic:{
    type: String
  },
  institution: {
    type: String,
    required: true,
  },
  universityCode: {
    type: String,
  },
  role: {
    type: String,
    default: "Lecturer",
  },
});

export default mongoose.model("Lecturer", lecturerSchema);
