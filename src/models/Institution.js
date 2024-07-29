import mongoose from "mongoose";

const institutionSchema = new mongoose.Schema({
  name: {
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
 
  code: {
    type: String,
  },
  role: {
    type: String,
    default: "Institution",
  },
  
});

export default mongoose.model("Institution", institutionSchema);
