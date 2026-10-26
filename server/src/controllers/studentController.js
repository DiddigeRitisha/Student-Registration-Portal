
const Student = require("../models/Student");

// Allowed student status values.
const VALID_STATUSES = ["New", "Active", "Inactive"];
/**
 * Normalizes student status values into New, Active, or Inactive.
 */
function normalizeStatus(value, isActive) {
  const status = String(value ?? "").trim().toLowerCase();

  if (["inactive", "in-active", "disabled"].includes(status)) {
    return "Inactive";
  }

  if (["active", "approved"].includes(status)) {
    return "Active";
  }

  if (["new", "pending"].includes(status)) {
    return "New";
  }

  if (isActive === false) return "Inactive";
  if (isActive === true) return "Active";

  return "New";
}

/**
 * Retrieves students belonging to the authenticated user.
 * Supports searching and filtering by department.
 */
async function listStudents(req, res, next) {
  try {
    const { search = "", department = "" } = req.query;
    const filter = { createdBy: req.user.id };

    if (search.trim()) {
      const regex = new RegExp(search.trim(), "i");

      filter.$or = [
        { studentId: regex },
        { fullName: regex },
        { email: regex },
        { course: regex },
      ];
    }

    if (department.trim()) {
      filter.department = department.trim();
    }

    const students = await Student.find(filter).sort({
      createdAt: -1,
    });

    res.json({
      count: students.length,
      students,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Retrieves a single student only if the record belongs to the current user.
 */
async function getStudent(req, res, next) {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json({ student });
  } catch (error) {
    next(error);
  }
}
/**
 * Creates a student and assigns ownership to the authenticated user.
 */
async function createStudent(req, res, next) {
  try {
    const status = normalizeStatus(
      req.body.status ?? req.body.studentStatus,
      req.body.isActive
    );

    const student = await Student.create({
      ...req.body,
      status,
      isActive: status === "Active",
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Student created successfully",
      student,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Updates an existing student after checking ownership and validating status.
 */
async function updateStudent(req, res, next) {
  try {
    const existingStudent = await Student.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!existingStudent) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // Preserve the existing status if the request doesn't include one.
    const incomingStatus = req.body.status ?? req.body.studentStatus;

    const status =
      incomingStatus === undefined
        ? normalizeStatus(
            existingStudent.status ?? existingStudent.studentStatus,
            existingStudent.isActive
          )
        : normalizeStatus(incomingStatus);

    if (
      incomingStatus !== undefined &&
      !VALID_STATUSES.includes(status)
    ) {
      return res.status(400).json({
        message: "Invalid student status",
      });
    }

    const updateData = {
      ...req.body,
      status,
      isActive: status === "Active",
    };

    // Prevent changes to ownership through the request body.
    delete updateData.createdBy;
    delete updateData._id;

    Object.assign(existingStudent, updateData);

    await existingStudent.save();

    res.json({
      message: "Student updated successfully",
      student: existingStudent,
    });
  } catch (error) {
    next(error);
  }
}
/**
 * Deletes a student only when the record belongs to the authenticated user.
 */
async function deleteStudent(req, res, next) {
  try {
    const student = await Student.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json({
      message: "Student deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

// Export controller functions for use by the student routes.
module.exports = {
  listStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
};
