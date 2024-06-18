import dotenv from "dotenv";
import connectDB from "./src/config/dbConn.js";
import mongoose from "mongoose";
import cors from "cors";
import corsOptions from "./src/config/corsOptions.js";
import express from "express";
import cookieParser from "cookie-parser";
import errorHandler from "./src/middleware/errorHandler.js";
import studentRoutes from "./src/routes/studentRoutes.js";
import lecturerRoutes from "./src/routes/lecturerRoutes.js";
import attendanceRoutes from "./src/routes/attendanceRoutes.js";
import attendanceTabRoutes from "./src/routes/attendanceTabRoutes.js";
import studentAuthRoutes from "./src/routes/studentAuthRoutes.js";
import lecturerAuthRoutes from "./src/routes/lecturerAuthRoutes.js";
import demoRoute from "./src/routes/demoRoute.js";
const app = express();
const PORT = process.env.PORT || 3500;
dotenv.config();
console.log(process.env.NODE_ENV);

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.use("/students", studentRoutes);
app.use("/lecturers", lecturerRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/attendanceTab", attendanceTabRoutes);
app.use("/student", studentAuthRoutes)
app.use("/lecturer", lecturerAuthRoutes)
app.use("/demo", demoRoute)
app.use(errorHandler);

app.listen(PORT, () => {
  connectDB()
  console.log(`Server running on port ${PORT}`);
});
