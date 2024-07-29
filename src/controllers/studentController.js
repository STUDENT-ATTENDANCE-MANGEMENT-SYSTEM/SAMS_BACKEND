import mongoose from "mongoose";
import Student from "../models/Student.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";

const getAllStudents = asyncHandler(async (req, res) => {
  const student = await Student.find().select("-password").lean();

  if (!student?.length) {
    return res.status(400).json({ message: "No Student found" });
  }

  res.json(student);
});

const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




const createNewStudent = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, password, institution, pic} = req.body;

  if (!firstname || !lastname || !email || !password || !institution) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const duplicate = await Student.findOne({ email }).lean().exec();

  if (duplicate) {
    return res
      .status(409)
      .json({ message: `Student with ${email} already exists` });
  }

  const hashedPwd = await bcrypt.hash(password, 10);

  const studentObject = {
    firstname,
    lastname,
    email,
    password: hashedPwd,
    institution,
    pic
  };

  const student = await Student.create(studentObject);

  if (student) {
    res
      .status(201)
      .json({ message: `${lastname}, your account has been created` });
  } else {
    res.status(400).json({ message: "Invalid student data received" });
  }
});
const updatePin = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { pin } = req.body;
 
  if (!id || !pin) {
    return res.status(400).json({ message: "Both id and pin are required" });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid id' });
  }
  const student = await Student.findByIdAndUpdate(
    id, // find a document with this id
    { pin }, // add pin to the document
    { new: true } // options
  );

  if (!student) {
    return res.status(404).json({ message: `Student with id ${id} not found` });
  }

  res.json(student);
});

const checkUserPinExists = asyncHandler(async (req, res) => {
  const { id, pin } = req.body;
  if (!id || !pin) {
    return res.status(400).json({ message: "Both id and pin are required" });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid id' });
  }
  const student = await Student.findById(id);
  if (student && student.pin === pin) {
    return res.json({ message: "PIN verified" });
  } else if (student) {
    return res.status(404).json({ message: "PIN does not match" });
  } else {
    return res.status(404).json({ message: `Student with id ${id} not found` });
  }
});


const changeStudentPin = asyncHandler(async (req, res) => {
  const { id, newPin } = req.body;
  if (!id || !newPin) {
    return res.status(400).json({ message: "Both id and newPin are required" });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid id' });
  }
  const student = await Student.findById(id);
  if (!student) {
    return res.status(404).json({ message: `Student with id ${id} not found` });
  }
  // Assuming the pin is a field in the student document and can be directly updated
  student.pin = newPin;
  await student.save();
  res.json({ message: "PIN changed successfully" });
});

const updateStudent = asyncHandler(async (req, res) => {
  const { id, firstname, lastname, email, password, institution } = req.body;

  if (!id || !firstname || !lastname || !email || !institution) {
    return res
      .status(400)
      .json({ message: "All fields except password are required" });
  }

  const student = await Student.findById(id).exec();

  if (!student) {
    return res.status(400).json({ message: "student not found" });
  }

  const duplicate = await Student.findOne({ email }).lean().exec();

  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate email" });
  }

  student.firstname = firstname;
  student.lastname = lastname;
  student.email = email;
  student.institution = institution;

  if (password) {
    // Hash password
    student.password = await bcrypt.hash(password, 10); // salt rounds
  }

  const updatedStudent = await student.save();

  res.json({ message: `${updatedStudent.email} updated` });
});

const deleteStudent = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "student ID Required" });
  }

  const student = await Student.findById(id).exec();

  if (!student) {
    return res.status(400).json({ message: "student not found" });
  }

  const result = await Student.deleteOne();

  const reply = ` ${result.email} with ID ${result._id} deleted`;

  res.json(reply);
});
export default {
  getAllStudents,
  createNewStudent,
  getStudentById,
  updateStudent,
  deleteStudent,
  updatePin,
  checkUserPinExists,
  changeStudentPin
};
