import mongoose from "mongoose";

const demoSchema = new mongoose.Schema({
  
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },

  telephone: {
    type: String,
    required: true,
  },
  
  response: {
    type: String,
  }
});

export default mongoose.model("Demo", demoSchema);