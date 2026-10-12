const express = require("express");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  profileValidator
} = require("../validators/authValidators");
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  updateMe
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);
router.post("/forgot-password", forgotPasswordValidator, validate, forgotPassword);
router.post("/reset-password", resetPasswordValidator, validate, resetPassword);
router.get("/me", auth, getMe);
router.put("/me", auth, profileValidator, validate, updateMe);

module.exports = router;
