const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // =========================
    // BASIC INFORMATION
    // =========================

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    // =========================
    // STUDENT INFORMATION
    // =========================

    studentId: {
      type: String,
      trim: true,
      default: "",
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    dateOfBirth: {
      type: String,
      trim: true,
      default: "",
    },

    gender: {
      type: String,
      trim: true,
      default: "",
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    // =========================
    // PROFILE PICTURE
    // =========================

    profilePicture: {
      type: String,
      default: "",
    },

    // =========================
    // ACADEMIC INFORMATION
    // =========================

    course: {
      type: String,
      trim: true,
      default: "",
    },

    department: {
      type: String,
      trim: true,
      default: "",
    },

    academicYear: {
      type: String,
      trim: true,
      default: "",
    },

    semester: {
      type: String,
      trim: true,
      default: "",
    },

    // =========================
    // PASSWORD RESET
    // =========================

    resetPasswordToken: {
      type: String,
      select: false,
    },

    resetPasswordExpires: {
      type: Date,
      select: false,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);