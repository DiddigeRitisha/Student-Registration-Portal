const { body } = require("express-validator");

const registerValidator = [
  body("name").trim().isLength({ min: 2, max: 80 }).withMessage("Name must be 2-80 characters"),
  body("email").isEmail().normalizeEmail().withMessage("Enter a valid email"),
  body("password").isLength({ min: 8 }).withMessage("Password must contain at least 8 characters")
];

const loginValidator = [
  body("email").isEmail().normalizeEmail().withMessage("Enter a valid email"),
  body("password").notEmpty().withMessage("Password is required")
];

const forgotPasswordValidator = [
  body("email").isEmail().normalizeEmail().withMessage("Enter a valid email")
];

const resetPasswordValidator = [
  body("token").isString().isLength({ min: 20 }).withMessage("Reset token is invalid"),
  body("password").isLength({ min: 8 }).withMessage("Password must contain at least 8 characters")
];

const profileValidator = [
  body("name").trim().isLength({ min: 2, max: 80 }).withMessage("Name must be 2-80 characters"),
  body("email").isEmail().normalizeEmail().withMessage("Enter a valid email")
];

module.exports = { registerValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator, profileValidator };
