import Student from "../../models/Student.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

const signup = async (req, res) => {
  const { firstname, lastname, email, password, institution, pic } = req.body;

  try {
    if (!firstname || !lastname || !email || !password || !institution || !pic) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Check if student already exists
    const existingStudent = await Student.findOne({ email });

    if (existingStudent) {
      return res.status(400).json({ message: "Student already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new student
    const newStudent = await Student.create({
      email,
      password: hashedPassword,
      firstname,
      lastname,
      institution,
      pic,
    });

    // Create JWT tokens
    const accessToken = jwt.sign(
      {
        email: newStudent.email,
        role: newStudent.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30m" }
    );

    const refreshToken = jwt.sign(
      { email: newStudent.email,
        role: newStudent.role
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Create secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: true, //https
      sameSite: "None", //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
    });

    return res.status(201).json({
      id: newStudent._id,
      name: newStudent.firstname + " " + newStudent.lastname,
      email: newStudent.email,
      institution: newStudent.institution,
      pic: newStudent.pic,
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const foundStudent = await Student.findOne({ email }).exec();

  if (!foundStudent) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const match = await bcrypt.compare(password, foundStudent.password);

  if (!match)
    return res.status(401).json({ message: "Invalid Password and Email" });

  const accessToken = jwt.sign(
    {
      email: foundStudent.email,
      role: foundStudent.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "30m" }
  );

  const refreshToken = jwt.sign(
    { email: foundStudent.email,
      role: foundStudent.role
     },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  // Create secure cookie with refresh token
  res.cookie("jwt", refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: "None", //cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
  });

  // Send accessToken containing email and roles
  res.json({ id: foundStudent._id , accessToken });
});

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });
      console.log('decoded:', decoded)
      const foundStudent = await Student.findOne({
        email: decoded.email,
        role: decoded.role,
      }).exec();

      if (!foundStudent)
        return res.status(401).json({ message: "Unauthorized" });

      const accessToken = jwt.sign(
        {
          email: foundStudent.email,
          role: foundStudent.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      res.json({ accessToken });
    })
  );
};

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: false });
  res.json({ message: "Cookie cleared" });
};

export default {
  signup,
  login,
  refresh,
  logout,
};
