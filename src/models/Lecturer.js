const mongoose = require("mongoose");

const lecturerSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    unique: true,
  },
  lastname: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  institution: {
    type: String,
    required: true,
  },
  universityCode: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "  Lecturer",
  },
});

module.exports = mongoose.model("Lecturer", lecturerSchema);
