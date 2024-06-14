import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
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
  institution: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "Student",
  },
  pin: {
    type: String,
  },
  pic: {
    type: String,
    default: "https://res.cloudinary.com/dk5bvgq20/image/upload/v1629540437/placeholder-image_1_zc1w9o.png",
  },
});

export default mongoose.model("Student", studentSchema);
