import Lecturer from "../models/Lecturer.js";
import Attendance from "../models/Attendance.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";

const getAllLecturers = asyncHandler(async (req, res) => {
  const lecturer = await Lecturer.find().select("-password").lean();

  if (!lecturer?.length) {
    return res.status(400).json({ message: "No Lecturer found" });
  }

  res.json(lecturer);
});

const createNewLecturer = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, password, institution, pic, perfix} =
    req.body;

  if (
    !firstname ||
    !lastname ||
    !email ||
    !password ||
    !institution ||
    !pic ||
    !perfix
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const duplicate = await Lecturer.findOne({ email }).lean().exec();

  if (duplicate) {
    return res
      .status(409)
      .json({ message: `Lecturer with ${email} already exists` });
  }

  const hashedPwd = await bcrypt.hash(password, 10);

  const lecturerObject = {
    firstname,
    lastname,
    email,
    password: hashedPwd,
    institution,
    pic,
    perfix,
  };

  const lecturer = await Lecturer.create(lecturerObject);

  if (lecturer) {
    res
      .status(201)
      .json({ message: `${email}, your account has been created` });
  } else {
    res.status(400).json({ message: "Invalid Lecturer data received" });
  }
});


const getLecturerById = async (req, res) => {
  try {
    const lecturer = await Lecturer.findById(req.params.lecturerId);
    if (!lecturer) {
      return res.status(404).json({ message: 'Lecturer not found' });
    }

    res.json(lecturer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateCode = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { universityCode } = req.body;
 
  if (!id || !universityCode) {
    return res.status(400).json({ message: "Both id and university code are required" });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid id' });
  }
  const lecturer = await Lecturer.findByIdAndUpdate(
    id, // find a document with this id
    { universityCode }, // add pin to the document
    { new: true } // options
  );

  if (!lecturer) {
    return res.status(404).json({ message: `Lecturer with id ${id} not found` });
  }

  res.json(lecturer);
});

const updateLecturer = asyncHandler(async (req, res) => {
  const {
    id,
    firstname,
    lastname,
    email,
    password,
    institution,
  } = req.body;

  if (
    !id ||
    !firstname ||
    !lastname ||
    !email ||
    !institution 
  ) {
    return res
      .status(400)
      .json({ message: "All fields except password are required" });
  }

  const lecturer = await Lecturer.findById(id).exec();

  if (!lecturer) {
    return res.status(400).json({ message: "Lecturer not found" });
  }

  const duplicate = await Lecturer.findOne({ email }).lean().exec();

  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate email" });
  }

  lecturer.firstname = firstname;
  lecturer.lastname = lastname;
  lecturer.email = email;
  lecturer.institution = institution;   


  if (password) {
    // Hash password
    lecturer.password = await bcrypt.hash(password, 10); // salt rounds
  }

  const updatedLecturer = await lecturer.save();

  res.json({ message: `${updatedLecturer.email} updated` });
});

const deleteLecturer = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Lecturer ID Required" });
  }
  const attendances = await Attendance.findOne({ user: id }).lean().exec();
  if (attendances) {
    return res.status(400).json({ message: "User has assigned attendances" });
  }
  const lecturer = await Lecturer.findById(id).exec();

  if (!lecturer) {
    return res.status(400).json({ message: "Lecturer not found" });
  }

  const result = await Lecturer.deleteOne();

  const reply = ` ${result.email} with ID ${result._id} deleted`;

  res.json(reply);
});
export default {
  getAllLecturers,
  getLecturerById,
  createNewLecturer,
  updateLecturer,
  updateCode,
  deleteLecturer,
};
