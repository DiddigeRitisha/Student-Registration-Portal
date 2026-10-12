
const { body } = require("express-validator");

const studentValidator = [
  body("studentId")
    .trim()
    .matches(/^STU[0-9]{4,}$/i)
    .withMessage("Student ID must look like STU1001"),

  body("fullName")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters"),

  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Enter a valid student email"),

  body("course")
    .trim()
    .notEmpty()
    .withMessage("Course is required"),

  body("year")
    .isInt({ min: 1, max: 6 })
    .withMessage("Year must be between 1 and 6"),

  body("department")
    .trim()
    .notEmpty()
    .withMessage("Department is required"),

  body("gender")
    .optional()
    .isIn(["Male", "Female", "Other"])
    .withMessage("Invalid gender")
];

module.exports = { studentValidator };