const Student = require("../models/Student");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const getAllStudents = asyncHandler(async (req, res) => {
  const student = await Student.find().select("-password").lean();

  if (!student?.length) {
    return res.status(400).json({ message: "No Student found" });
  }

  res.json(student);
});

const createNewStudent = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, password, institution } = req.body;

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

module.exports = {
  getAllStudents,
  createNewStudent,
  updateStudent,
  deleteStudent,
};
