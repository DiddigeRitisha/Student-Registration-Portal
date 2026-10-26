const { body } = require("express-validator");
/**
 * Validates student data before it reaches the controller.
 * Checks student ID format, full name, email, course,
 * academic year, department, and optional gender.
 * Returns validation messages for fields that fail the rules.
 */
// Validate the student's full name and its length.
// Validate the email format and normalize it.
// Require a course name.
// Restrict the academic year to integers from 1 to 6.
// Require a department name.
// Allow gender to be optional but restrict its values.
const studentValidator = [
  // Require a student ID such as STU1001.
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