const express = require("express");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { studentValidator } = require("../validators/studentValidators");
const {
  listStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent
} = require("../controllers/studentController");

const router = express.Router();

router.use(auth);

router.get("/", listStudents);
router.get("/:id", getStudent);
router.post("/", studentValidator, validate, createStudent);
router.put("/:id", studentValidator, validate, updateStudent);
router.delete("/:id", deleteStudent);

module.exports = router;
