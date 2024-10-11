const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { findUser, getFiledInfoData } = require("../../utils");
const { logger } = require("../../logger");

// Register
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    // Check exists userName
    const checkUserName = await findUser({ userName });
    if (checkUserName) {
      return logger({
        res,
        success: false,
        message:
          "Username already exists with the same Username! Please try again",
      });
    }

    // Check if email already exists
    const checkUserEmail = await findUser({ email });
    if (checkUserEmail) {
      return logger({
        res,
        success: false,
        message: "Email already exists with the same email! Please try again",
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });

    await newUser.save();
    return logger({
      res,
      success: true,
      message: "Registration successful",
    });
  } catch (e) {
    console.log(e);
    return logger({
      res,
      success: false,
      message: "Some error occured",
      statusCode: 500,
    });
  }
};

// Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await findUser({ email });
    if (!checkUser) {
      return logger({
        res,
        success: false,
        message: "User doesn't exist! Please register first",
      });
    }

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch) {
      return logger({
        res,
        success: false,
        message: "Email or passwords do not match! Please try again",
      });
    }

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "60m" }
    );

    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Logged in successfully",
      user: getFiledInfoData({ listFiled: ["_id", "email", "role","userName"], object: checkUser }),
    });
  } catch (e) {
    return logger({
      res,
      success: false,
      message: "Some error occured",
      statusCode: 500,
    });
  }
};

// Logout
const logoutUser = async (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully",
  });
};

// auth middleware
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return logger({
      res,
      success: false,
      message: "Unauthorized user!",
      statusCode: 401,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = getFiledInfoData({ listFiled: ["id", "email", "role","userName"], object: decoded });
    next();
  } catch (e) {
    return logger({
      res,
      success: false,
      message: "Unauthorized user!",
      statusCode: 401,
    });
  }
};

module.exports = { registerUser, loginUser, logoutUser, authMiddleware };
