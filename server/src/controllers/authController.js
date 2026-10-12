const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");

function createToken(user) {
  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "2h",
    }
  );
}

/*
  This controls which user information
  is sent to the frontend.
*/
function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,

    // Student information
    studentId: user.studentId || "",
    phone: user.phone || "",
    dateOfBirth: user.dateOfBirth || "",
    gender: user.gender || "",
    address: user.address || "",

    // Profile picture
    profilePicture: user.profilePicture || "",

    // Academic information
    course: user.course || "",
    department: user.department || "",
    academicYear: user.academicYear || "",
    semester: user.semester || "",

    createdAt: user.createdAt,
  };
}


/* =========================================================
   REGISTER
   ========================================================= */

async function register(req, res, next) {
  try {
    const {
      name,
      email,
      password,

      studentId,
      phone,
      dateOfBirth,
      gender,
      address,

      course,
      department,
      academicYear,
      semester,
    } = req.body;

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(409).json({
        message: "Email is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,

      studentId: studentId || "",
      phone: phone || "",
      dateOfBirth: dateOfBirth || "",
      gender: gender || "",
      address: address || "",

      course: course || "",
      department: department || "",
      academicYear: academicYear || "",
      semester: semester || "",

      profilePicture: "",
    });

    res.status(201).json({
      message: "Registration successful",
      token: createToken(user),
      user: publicUser(user),
    });
  } catch (error) {
    next(error);
  }
}


/* =========================================================
   LOGIN
   ========================================================= */

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    res.json({
      message: "Login successful",
      token: createToken(user),
      user: publicUser(user),
    });
  } catch (error) {
    next(error);
  }
}


/* =========================================================
   FORGOT PASSWORD
   ========================================================= */

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    const generic =
      "If an account exists for this email, a reset link has been created.";

    if (!user) {
      return res.json({
        message: generic,
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save({
      validateBeforeSave: false,
    });

    const clientUrl =
      process.env.CLIENT_URL || "http://localhost:5173";

    const resetUrl =
      `${clientUrl}/reset-password?token=${rawToken}`;

    const response = {
      message: generic,
    };

    if (process.env.NODE_ENV !== "production") {
      response.resetUrl = resetUrl;
    }

    res.json(response);
  } catch (error) {
    next(error);
  }
}


/* =========================================================
   RESET PASSWORD
   ========================================================= */

async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(token || "")
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: {
        $gt: Date.now(),
      },
    }).select("+password +resetPasswordToken +resetPasswordExpires");

    if (!user) {
      return res.status(400).json({
        message: "Reset link is invalid or expired",
      });
    }

    user.password = await bcrypt.hash(password, 12);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
}


/* =========================================================
   GET CURRENT USER
   ========================================================= */

async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      user: publicUser(user),
    });
  } catch (error) {
    next(error);
  }
}


/* =========================================================
   UPDATE PROFILE
   ========================================================= */

async function updateMe(req, res, next) {
  try {
    const {
      name,
      email,

      studentId,
      phone,
      dateOfBirth,
      gender,
      address,

      course,
      department,
      academicYear,
      semester,

      profilePicture,
    } = req.body;

    // Check whether another account already uses this email
    const duplicate = await User.findOne({
      email,
      _id: {
        $ne: req.user.id,
      },
    });

    if (duplicate) {
      return res.status(409).json({
        message: "Email is already in use",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        email,

        studentId,
        phone,
        dateOfBirth,
        gender,
        address,

        course,
        department,
        academicYear,
        semester,

        profilePicture: profilePicture || "",
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "Profile updated successfully",
      user: publicUser(user),
    });
  } catch (error) {
    next(error);
  }
}


/* =========================================================
   EXPORTS
   ========================================================= */

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  updateMe,
};