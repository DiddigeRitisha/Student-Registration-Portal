import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  UserPlus,
  Pencil,
  IdCard,
  User,
  Mail,
  Phone,
  CalendarDays,
  BookOpen,
  Building2,
  GraduationCap,
  VenusAndMars,
  BadgeCheck,
  MapPin,
} from "lucide-react";

import { apiRequest } from "../services/api";

const initialForm = {
  studentId: "",
  fullName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  address: "",
  course: "",
  year: "1",
  department: "",
  gender: "Male",
  status: "New",
};

const VALID_STATUSES = ["New", "Active", "Inactive"];

function normalizeStatus(value, isActive) {
  const status = String(value ?? "").trim().toLowerCase();

  if (["inactive", "in-active", "disabled"].includes(status)) {
    return "Inactive";
  }

  if (["new", "pending"].includes(status)) {
    return "New";
  }

  if (["active", "approved"].includes(status)) {
    return "Active";
  }

  if (isActive === false) return "Inactive";
  if (isActive === true) return "Active";

  return "New";
}

function formatDate(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function getStudentId(student) {
  return student?._id || student?.id || "";
}

function getSavedStudent(response) {
  return (
    response?.student ||
    response?.data?.student ||
    response?.data?.data?.student ||
    response?.data ||
    response
  );
}

export default function AddStudent() {
  const navigate = useNavigate();
  const location = useLocation();

  const editingStudent = location.state?.student || null;
  const editMode = Boolean(
    location.state?.editMode && editingStudent
  );

  const [form, setForm] = useState({ ...initialForm });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editMode || !editingStudent) {
      setForm({ ...initialForm });
      setError("");
      return;
    }

    setForm({
      studentId:
        editingStudent.studentId ??
        editingStudent.rollNumber ??
        "",
      fullName:
        editingStudent.fullName ??
        editingStudent.name ??
        "",
      email: editingStudent.email ?? "",
      phone:
        editingStudent.phone ??
        editingStudent.phoneNumber ??
        "",
      dateOfBirth: formatDate(
        editingStudent.dateOfBirth ??
        editingStudent.dob
      ),
      address: editingStudent.address ?? "",
      course: editingStudent.course ?? "",
      year: String(editingStudent.year ?? "1"),
      department: editingStudent.department ?? "",
      gender: editingStudent.gender ?? "Male",
      status: normalizeStatus(
        editingStudent.status ??
        editingStudent.studentStatus,
        editingStudent.isActive
      ),
    });

    setError("");
  }, [editMode, editingStudent]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  }

  function validateForm() {
    if (!form.studentId.trim()) {
      return "Please enter the Student ID.";
    }

    if (!form.fullName.trim()) {
      return "Please enter the student's full name.";
    }

    if (!form.email.trim()) {
      return "Please enter the email address.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      return "Please enter a valid email address.";
    }

    if (!form.phone.trim()) {
      return "Please enter the phone number.";
    }

    if (!form.dateOfBirth) {
      return "Please select the date of birth.";
    }

    if (form.dateOfBirth > formatDate(new Date())) {
      return "Date of birth cannot be in the future.";
    }

    if (!form.course.trim()) {
      return "Please enter the course.";
    }

    if (!form.department.trim()) {
      return "Please enter the department.";
    }

    if (!form.address.trim()) {
      return "Please enter the address.";
    }

    if (!VALID_STATUSES.includes(form.status)) {
      return "Please select a valid student status.";
    }

    if (!["1", "2", "3", "4"].includes(String(form.year))) {
      return "Please select a valid year.";
    }

    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const studentId = getStudentId(editingStudent);

    if (editMode && !studentId) {
      setError("Student ID is missing. Please return to Students and try again.");
      return;
    }

    setLoading(true);

    try {
      const selectedStatus = form.status;

      const studentData = {
        studentId: form.studentId.trim(),
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        dateOfBirth: form.dateOfBirth,
        address: form.address.trim(),
        course: form.course.trim(),
        year: Number(form.year),
        department: form.department.trim(),
        gender: form.gender,

        // Keep the selected status consistent.
        status: selectedStatus,
        studentStatus: selectedStatus,
        isActive: selectedStatus === "Active",
      };

      const response = await apiRequest(
        editMode ? `/students/${studentId}` : "/students",
        {
          method: editMode ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(studentData),
        }
      );

      const savedStudent = getSavedStudent(response);

      // Notify the Students and Dashboard pages to refresh.
      window.dispatchEvent(new Event("students-updated"));

      navigate("/students", {
        replace: true,
        state: {
          studentUpdated: true,
          refreshStudents: true,
          savedStudent,
        },
      });
    } catch (err) {
      console.error("Save student error:", err);

      setError(
        err.message ||
        "Unable to save student. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    navigate("/students");
  }

  return (
    <section className="students-page">
      <div className="panel-header">
        <div>
          <h1>{editMode ? "Edit Student" : "Add Student"}</h1>
          <p>
            {editMode
              ? "Update the student's registration details."
              : "Enter the details to register a student."}
          </p>
        </div>

        <div className="panel-header-icon">
          {editMode
            ? <Pencil size={28} />
            : <UserPlus size={28} />}
        </div>
      </div>

      <form className="student-form" onSubmit={handleSubmit}>
        <div className="student-form-grid">
          <label className="form-field">
            <span>
              <IdCard size={16} />
              Student ID <b className="required-star">*</b>
            </span>
            <div className="input-with-icon">
              <input
                name="studentId"
                type="text"
                value={form.studentId}
                onChange={handleChange}
                placeholder="Enter student ID"
                required
              />
            </div>
          </label>

          <label className="form-field">
            <span>
              <User size={16} />
              Full Name <b className="required-star">*</b>
            </span>
            <div className="input-with-icon">
              <input
                name="fullName"
                type="text"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />
            </div>
          </label>

          <label className="form-field">
            <span>
              <Mail size={16} />
              Email Address <b className="required-star">*</b>
            </span>
            <div className="input-with-icon">
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
              />
            </div>
          </label>

          <label className="form-field">
            <span>
              <Phone size={16} />
              Phone Number <b className="required-star">*</b>
            </span>
            <div className="input-with-icon">
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                maxLength={15}
                required
              />
            </div>
          </label>

          <label className="form-field">
            <span>
              <CalendarDays size={16} />
              Date of Birth <b className="required-star">*</b>
            </span>
            <div className="input-with-icon">
              <input
                name="dateOfBirth"
                type="date"
                value={form.dateOfBirth}
                onChange={handleChange}
                max={formatDate(new Date())}
                required
              />
            </div>
          </label>

          <label className="form-field">
            <span>
              <BookOpen size={16} />
              Course <b className="required-star">*</b>
            </span>
            <div className="input-with-icon">
              <input
                name="course"
                type="text"
                value={form.course}
                onChange={handleChange}
                placeholder="Enter course"
                required
              />
            </div>
          </label>

          <label className="form-field">
            <span>
              <Building2 size={16} />
              Department <b className="required-star">*</b>
            </span>
            <div className="input-with-icon">
              <input
                name="department"
                type="text"
                value={form.department}
                onChange={handleChange}
                placeholder="Enter department"
                required
              />
            </div>
          </label>

          <label className="form-field">
            <span>
              <GraduationCap size={16} />
              Year
            </span>
            <div className="input-with-icon">
              <select
                name="year"
                value={form.year}
                onChange={handleChange}
              >
                <option value="1">First Year</option>
                <option value="2">Second Year</option>
                <option value="3">Third Year</option>
                <option value="4">Final Year</option>
              </select>
            </div>
          </label>

          <label className="form-field">
            <span>
              <VenusAndMars size={16} />
              Gender
            </span>
            <div className="input-with-icon">
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </label>

          <label className="form-field">
            <span>
              <BadgeCheck size={16} />
              Student Status
            </span>
            <div className="input-with-icon">
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="New">New</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </label>

          <label className="form-field form-field-full">
            <span>
              <MapPin size={16} />
              Address <b className="required-star">*</b>
            </span>
            <div className="textarea-with-icon">
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter student's full address"
                rows={4}
                required
              />
            </div>
          </label>
        </div>

        {error && (
          <p className="alert error" role="alert">
            {error}
          </p>
        )}

        <div className="student-form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : editMode
                ? "Update Student"
                : "Add Student"}
          </button>
        </div>
      </form>
    </section>
  );
}