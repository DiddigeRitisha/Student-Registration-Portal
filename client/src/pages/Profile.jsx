import React, { useEffect, useRef, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  BookOpen,
  Hash,
  GraduationCap,
  Pencil,
  Save,
  X,
  Camera,
  Trash2,
} from "lucide-react";

import { apiRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { setUser: setAuthUser } = useAuth();

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputRef = useRef(null);

  // =========================================================
  // LOAD PROFILE
  // =========================================================

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/auth/me");

      if (!data?.user) {
        throw new Error("User profile was not found.");
      }

      const currentUser = data.user;

      setUser(currentUser);

      setForm({
        name: currentUser.name || "",
        email: currentUser.email || "",
        studentId: currentUser.studentId || "",
        phone: currentUser.phone || "",
        dateOfBirth: currentUser.dateOfBirth || "",
        gender: currentUser.gender || "",
        address: currentUser.address || "",
        course: currentUser.course || "",
        department: currentUser.department || "",
        academicYear: currentUser.academicYear || "",
        semester: currentUser.semester || "",
        profilePicture: currentUser.profilePicture || "",
      });
    } catch (err) {
      console.error("Profile loading error:", err);

      setError(
        err?.message || "Unable to load profile."
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // =========================================================
  // OPEN PROFILE PICTURE PICKER
  // =========================================================

  function openProfilePicturePicker() {
    if (!editing) return;

    setError("");

    fileInputRef.current?.click();
  }

  // =========================================================
  // UPLOAD PROFILE PICTURE
  // =========================================================

  function handleProfilePicture(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    // Only images
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      event.target.value = "";
      return;
    }

    // Maximum 5 MB
    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Profile picture must be smaller than 5 MB."
      );

      event.target.value = "";
      return;
    }

    setError("");
    setSuccess("");

    const reader = new FileReader();

    reader.onload = () => {
      setForm((previous) => ({
        ...previous,
        profilePicture: reader.result,
      }));
    };

    reader.onerror = () => {
      setError(
        "Unable to read the selected image."
      );
    };

    reader.readAsDataURL(file);

    // Allows selecting the same image again later
    event.target.value = "";
  }

  // =========================================================
  // REMOVE PROFILE PICTURE
  // =========================================================

  function removeProfilePicture() {
    setForm((previous) => ({
      ...previous,
      profilePicture: "",
    }));

    setError("");
    setSuccess("");
  }

  // =========================================================
  // SAVE PROFILE
  // =========================================================

  async function saveProfile(event) {
    event.preventDefault();

    if (saving) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const data = await apiRequest("/auth/me", {
        method: "PUT",

        body: JSON.stringify({
          name: form.name?.trim() || "",
          email: form.email?.trim() || "",

          studentId:
            form.studentId?.trim() || "",

          phone:
            form.phone?.trim() || "",

          dateOfBirth:
            form.dateOfBirth || "",

          gender:
            form.gender || "",

          address:
            form.address?.trim() || "",

          course:
            form.course?.trim() || "",

          department:
            form.department?.trim() || "",

          academicYear:
            form.academicYear || "",

          semester:
            form.semester || "",

          // Empty string means remove picture
          profilePicture:
            form.profilePicture || "",
        }),
      });

      if (!data?.user) {
        throw new Error(
          "Profile was not returned by the server."
        );
      }

      const updatedUser = data.user;

      // Update local profile
      setUser(updatedUser);

      // Update form with saved data
      setForm({
        name: updatedUser.name || "",
        email: updatedUser.email || "",
        studentId: updatedUser.studentId || "",
        phone: updatedUser.phone || "",
        dateOfBirth:
          updatedUser.dateOfBirth || "",
        gender: updatedUser.gender || "",
        address: updatedUser.address || "",
        course: updatedUser.course || "",
        department:
          updatedUser.department || "",
        academicYear:
          updatedUser.academicYear || "",
        semester:
          updatedUser.semester || "",
        profilePicture:
          updatedUser.profilePicture || "",
      });

      // IMPORTANT:
      // Update AuthContext so Layout.jsx immediately
      // changes from photo -> flower or flower -> photo.
      if (setAuthUser) {
        setAuthUser(updatedUser);
      }

      // Notify other parts of the application
      window.dispatchEvent(
        new Event("profile-picture-updated")
      );

      setEditing(false);

      setSuccess(
        updatedUser.profilePicture
          ? "Profile and picture updated successfully."
          : "Profile updated and picture removed successfully."
      );

      window.setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(
        "Profile update error:",
        err
      );

      setError(
        err?.message ||
          "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================================================
  // CANCEL EDIT
  // =========================================================

  function cancelEdit() {
    if (!user) return;

    setForm({
      name: user.name || "",
      email: user.email || "",
      studentId: user.studentId || "",
      phone: user.phone || "",
      dateOfBirth:
        user.dateOfBirth || "",
      gender: user.gender || "",
      address: user.address || "",
      course: user.course || "",
      department:
        user.department || "",
      academicYear:
        user.academicYear || "",
      semester:
        user.semester || "",
      profilePicture:
        user.profilePicture || "",
    });

    setError("");
    setSuccess("");
    setEditing(false);
  }

  // =========================================================
  // VALUE HELPER
  // =========================================================

  function value(currentValue) {
    if (
      currentValue === undefined ||
      currentValue === null ||
      currentValue === ""
    ) {
      return "Not provided";
    }

    return currentValue;
  }

  // =========================================================
  // FORMAT DATE
  // =========================================================

  function formatDate(dateValue) {
    if (!dateValue) {
      return "Not provided";
    }

    // Registration date format: YYYY-MM-DD
    if (
      /^\d{4}-\d{2}-\d{2}$/.test(
        dateValue
      )
    ) {
      const [year, month, day] =
        dateValue.split("-");

      return `${day}-${month}-${year}`;
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          Loading profile...
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR WITHOUT USER
  // =========================================================

  if (error && !user) {
    return (
      <div className="profile-page">
        <div className="profile-error">
          <h2>
            Unable to load profile
          </h2>

          <p>{error}</p>

          <button
            type="button"
            onClick={loadProfile}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // NO USER
  // =========================================================

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-error">
          <h2>User not found</h2>

          <p>
            Please login again.
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="profile-page">

      {/* =====================================================
          PAGE TITLE
      ===================================================== */}

      <div className="profile-title">
        <h2>Student Profile</h2>
      </div>

      {/* =====================================================
          SUCCESS MESSAGE
      ===================================================== */}

      {success && (
        <div className="profile-success-message">
          {success}
        </div>
      )}

      {/* =====================================================
          ERROR MESSAGE
      ===================================================== */}

      {error && user && (
        <div className="profile-error-message">
          {error}
        </div>
      )}

      {/* =====================================================
          PROFILE FORM
      ===================================================== */}

      <form
        className="profile-layout"
        onSubmit={saveProfile}
      >

        {/* ===================================================
            LEFT CARD
        =================================================== */}

        <div className="profile-main-card">

          {/* =================================================
              STUDENT HEADER
          ================================================= */}

          <div className="student-header">

            {/* PROFILE PHOTO AREA */}

            <div className="profile-photo-wrapper">

              <div
                className="student-avatar"
                onClick={
                  openProfilePicturePicker
                }
                style={{
                  position:
                    "relative",
                  cursor: editing
                    ? "pointer"
                    : "default",
                  overflow: "hidden",
                }}
                title={
                  editing
                    ? "Click to change profile picture"
                    : "Profile picture"
                }
              >

                {/* SHOW PHOTO */}

                {form.profilePicture ? (
                  <img
                    src={
                      form.profilePicture
                    }
                    alt="Profile"
                    className="student-profile-image"
                  />
                ) : (
                  <User size={30} />
                )}

                {/* CAMERA OVERLAY */}

                {editing && (
                  <div className="profile-camera-overlay">
                    <Camera size={15} />
                  </div>
                )}

              </div>

              {/* HIDDEN FILE INPUT */}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={
                  handleProfilePicture
                }
                style={{
                  display: "none",
                }}
              />

              {/* REMOVE PICTURE BUTTON */}

              {editing &&
                form.profilePicture && (
                  <button
                    type="button"
                    className="remove-profile-picture-button"
                    onClick={
                      removeProfilePicture
                    }
                    disabled={saving}
                  >
                    <Trash2 size={13} />
                    Remove Picture
                  </button>
                )}

            </div>

            {/* =================================================
                BASIC INFORMATION
            ================================================= */}

            <div className="student-basic">

              <h3>
                {editing
                  ? form.name ||
                    "Student"
                  : value(user.name)}
              </h3>

              <p className="student-email">
                {editing
                  ? form.email ||
                    "Email"
                  : value(user.email)}
              </p>

              <span className="active-status">
                Active
              </span>

            </div>

            {/* =================================================
                EDIT / SAVE / CANCEL
            ================================================= */}

            {!editing ? (
              <button
                className="edit-profile-button"
                type="button"
                onClick={() => {
                  setError("");
                  setSuccess("");
                  setEditing(true);
                }}
              >
                <Pencil size={13} />
                Edit Profile
              </button>
            ) : (
              <div
                className="profile-edit-buttons"
              >

                {/* SAVE */}

                <button
                  className="edit-profile-button"
                  type="submit"
                  disabled={saving}
                >
                  <Save size={13} />

                  {saving
                    ? "Saving..."
                    : "Save"}
                </button>

                {/* CANCEL */}

                <button
                  type="button"
                  className="profile-cancel-button"
                  onClick={
                    cancelEdit
                  }
                  disabled={saving}
                >
                  <X size={13} />
                  Cancel
                </button>

              </div>
            )}

          </div>

          {/* =================================================
              PERSONAL INFORMATION
          ================================================= */}

          <div className="profile-section">

            <div className="section-heading">
              <User size={17} />
              <span>
                Personal Information
              </span>
            </div>

            <div className="profile-fields">

              {/* FULL NAME */}

              <div className="profile-field">
                <label>
                  Full Name
                </label>

                {editing ? (
                  <input
                    className="profile-input"
                    name="name"
                    value={
                      form.name || ""
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                ) : (
                  <div className="profile-value">
                    <User size={15} />
                    <span>
                      {value(
                        user.name
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* EMAIL */}

              <div className="profile-field">
                <label>
                  Email
                </label>

                {editing ? (
                  <input
                    className="profile-input"
                    name="email"
                    type="email"
                    value={
                      form.email || ""
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                ) : (
                  <div className="profile-value">
                    <Mail size={15} />
                    <span>
                      {value(
                        user.email
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* PHONE */}

              <div className="profile-field">
                <label>
                  Phone Number
                </label>

                {editing ? (
                  <input
                    className="profile-input"
                    name="phone"
                    value={
                      form.phone || ""
                    }
                    onChange={
                      handleChange
                    }
                  />
                ) : (
                  <div className="profile-value">
                    <Phone size={15} />
                    <span>
                      {value(
                        user.phone
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* DATE OF BIRTH */}

              <div className="profile-field">
                <label>
                  Date of Birth
                </label>

                {editing ? (
                  <input
                    className="profile-input"
                    name="dateOfBirth"
                    type="date"
                    value={
                      form.dateOfBirth ||
                      ""
                    }
                    onChange={
                      handleChange
                    }
                  />
                ) : (
                  <div className="profile-value">
                    <Calendar size={15} />
                    <span>
                      {formatDate(
                        user.dateOfBirth
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* GENDER */}

              <div className="profile-field">
                <label>
                  Gender
                </label>

                {editing ? (
                  <select
                    className="profile-input"
                    name="gender"
                    value={
                      form.gender || ""
                    }
                    onChange={
                      handleChange
                    }
                  >
                    <option value="">
                      Select gender
                    </option>

                    <option value="Male">
                      Male
                    </option>

                    <option value="Female">
                      Female
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                ) : (
                  <div className="profile-value">
                    <User size={15} />
                    <span>
                      {value(
                        user.gender
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* ADDRESS */}

              <div className="profile-field profile-full">
                <label>
                  Address
                </label>

                {editing ? (
                  <textarea
                    className="profile-input"
                    name="address"
                    value={
                      form.address || ""
                    }
                    onChange={
                      handleChange
                    }
                    rows="3"
                  />
                ) : (
                  <div className="profile-value">
                    <MapPin size={15} />
                    <span>
                      {value(
                        user.address
                      )}
                    </span>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* =================================================
              ACADEMIC INFORMATION
          ================================================= */}

          <div className="profile-section">

            <div className="section-heading">
              <GraduationCap size={17} />

              <span>
                Academic Information
              </span>
            </div>

            <div className="profile-fields">

              {/* STUDENT ID */}

              <div className="profile-field">
                <label>
                  Student ID
                </label>

                {editing ? (
                  <input
                    className="profile-input"
                    name="studentId"
                    value={
                      form.studentId ||
                      ""
                    }
                    onChange={
                      handleChange
                    }
                  />
                ) : (
                  <div className="profile-value">
                    <Hash size={15} />
                    <span>
                      {value(
                        user.studentId
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* COURSE */}

              <div className="profile-field">
                <label>
                  Course
                </label>

                {editing ? (
                  <input
                    className="profile-input"
                    name="course"
                    value={
                      form.course || ""
                    }
                    onChange={
                      handleChange
                    }
                  />
                ) : (
                  <div className="profile-value">
                    <BookOpen size={15} />
                    <span>
                      {value(
                        user.course
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* DEPARTMENT */}

              <div className="profile-field">
                <label>
                  Department
                </label>

                {editing ? (
                  <input
                    className="profile-input"
                    name="department"
                    value={
                      form.department ||
                      ""
                    }
                    onChange={
                      handleChange
                    }
                  />
                ) : (
                  <div className="profile-value">
                    <GraduationCap
                      size={15}
                    />

                    <span>
                      {value(
                        user.department
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* ACADEMIC YEAR */}

              <div className="profile-field">
                <label>
                  Academic Year
                </label>

                {editing ? (
                  <input
                    className="profile-input"
                    name="academicYear"
                    value={
                      form.academicYear ||
                      ""
                    }
                    onChange={
                      handleChange
                    }
                  />
                ) : (
                  <div className="profile-value">
                    <Calendar size={15} />

                    <span>
                      {value(
                        user.academicYear
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* SEMESTER */}

              <div className="profile-field">
                <label>
                  Semester
                </label>

                {editing ? (
                  <input
                    className="profile-input"
                    name="semester"
                    value={
                      form.semester || ""
                    }
                    onChange={
                      handleChange
                    }
                  />
                ) : (
                  <div className="profile-value">
                    <BookOpen size={15} />

                    <span>
                      {value(
                        user.semester
                      )}
                    </span>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>

        {/* =====================================================
            RIGHT SIDE
        ===================================================== */}

        <div className="profile-side">

          {/* =================================================
              ACADEMIC DETAILS
          ================================================= */}

          <div className="side-card">

            <div className="side-card-title">
              <GraduationCap size={17} />

              <span>
                Academic Details
              </span>
            </div>

            <div className="academic-row">
              <span>
                Student ID
              </span>

              <strong>
                {value(
                  user.studentId
                )}
              </strong>
            </div>

            <div className="academic-row">
              <span>
                Course
              </span>

              <strong>
                {value(
                  user.course
                )}
              </strong>
            </div>

            <div className="academic-row">
              <span>
                Department
              </span>

              <strong>
                {value(
                  user.department
                )}
              </strong>
            </div>

            <div className="academic-row">
              <span>
                Academic Year
              </span>

              <strong>
                {value(
                  user.academicYear
                )}
              </strong>
            </div>

            <div className="academic-row">
              <span>
                Semester
              </span>

              <strong>
                {value(
                  user.semester
                )}
              </strong>
            </div>

            <div className="academic-row">
              <span>
                Status
              </span>

              <span className="active-status">
                Active
              </span>
            </div>

          </div>

          {/* =================================================
              QUICK ACTIONS
          ================================================= */}

          <div className="side-card">

            <div className="side-card-title">
              Quick Actions
            </div>

            <div className="quick-actions">

              <button
                type="button"
                onClick={() =>
                  navigateToChangePassword()
                }
              >
                Change Password
              </button>

              <button
                type="button"
                className="logout-action"
                onClick={() => {
                  localStorage.removeItem(
                    "token"
                  );

                  window.location.href =
                    "/login";
                }}
              >
                Logout
              </button>

            </div>

          </div>

        </div>

      </form>
    </div>
  );
}

// =============================================================
// CHANGE PASSWORD PLACEHOLDER
// =============================================================

function navigateToChangePassword() {
  // Change this to your reset/change-password route
  window.location.href =
    "/forgot-password";
}