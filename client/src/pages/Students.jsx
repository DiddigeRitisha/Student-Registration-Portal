import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Search,
  Plus,
  Users,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import { apiRequest } from "../services/api";


function getStudentStatus(student) {
  const status = String(
    student.status ?? student.studentStatus ?? ""
  )
    .trim()
    .toLowerCase();

  if (["inactive", "in-active", "disabled"].includes(status)) {
    return "Inactive";
  }

  if (["new", "pending"].includes(status)) {
    return "New";
  }

  if (["active", "approved"].includes(status)) {
    return "Active";
  }

  if (student.isActive === false) return "Inactive";
  if (student.isActive === true) return "Active";

  return "New";
}

function getStatusClass(status) {
  if (status === "Active") return "status-active";
  if (status === "Inactive") return "status-inactive";
  return "status-new";
}

export default function Students() {
  const navigate = useNavigate();
  const location = useLocation();

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All Courses");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const pageSize = 6;

  /* =========================================================
     LOAD STUDENTS
  ========================================================= */

  const loadStudents = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      setError("");

      const response = await apiRequest("/students");

      const list = Array.isArray(response)
        ? response
        : response?.students ??
          response?.data?.students ??
          response?.data?.data ??
          response?.data ??
          [];

      if (!Array.isArray(list)) {
        throw new Error("Invalid student records response.");
      }

      setStudents(list);
    } catch (err) {
      console.error("Load students error:", err);
      setError(err.message || "Unable to load students.");
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

  /* =========================================================
     INITIAL LOAD + AUTO REFRESH
  ========================================================= */

  useEffect(() => {
    loadStudents();

    const handleStudentsUpdated = () => {
      loadStudents(false);
    };

    const handleFocus = () => {
      loadStudents(false);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadStudents(false);
      }
    };

    window.addEventListener(
      "students-updated",
      handleStudentsUpdated
    );

    window.addEventListener("focus", handleFocus);

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    const refreshInterval = window.setInterval(() => {
      loadStudents(false);
    }, 10000);

    return () => {
      window.removeEventListener(
        "students-updated",
        handleStudentsUpdated
      );

      window.removeEventListener("focus", handleFocus);

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

      window.clearInterval(refreshInterval);
    };
  }, [loadStudents]);

  /* =========================================================
     REFRESH AFTER ADD / EDIT
  ========================================================= */

  useEffect(() => {
    if (
      location.state?.studentUpdated ||
      location.state?.refreshStudents
    ) {
      loadStudents(false);

      navigate(location.pathname, {
        replace: true,
        state: null,
      });
    }
  }, [
    location.state,
    location.pathname,
    navigate,
    loadStudents,
  ]);

  /* =========================================================
     COURSE FILTER OPTIONS
  ========================================================= */

  const courses = useMemo(() => {
    return [
      ...new Set(
        students
          .map((student) =>
            String(student.course || "").trim()
          )
          .filter(Boolean)
      ),
    ].sort();
  }, [students]);

  /* =========================================================
     FILTER STUDENTS
  ========================================================= */

  const filteredStudents = useMemo(() => {
    const term = search.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch = [
        student.studentId,
        student.rollNumber,
        student.fullName,
        student.name,
        student.email,
        student.course,
        student.department,
        student.phone,
        student.phoneNumber,
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(term)
      );

      const matchesCourse =
        courseFilter === "All Courses" ||
        String(student.course || "").trim() ===
          courseFilter;

      const matchesStatus =
        statusFilter === "All Status" ||
        getStudentStatus(student) === statusFilter;

      return (
        matchesSearch &&
        matchesCourse &&
        matchesStatus
      );
    });
  }, [
    students,
    search,
    courseFilter,
    statusFilter,
  ]);

  /* =========================================================
     PAGINATION
  ========================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredStudents.length / pageSize)
  );

  const currentPage = Math.min(page, totalPages);

  useEffect(() => {
    if (page !== currentPage) {
      setPage(currentPage);
    }
  }, [page, currentPage]);

  const visibleStudents = filteredStudents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  /* =========================================================
     VIEW STUDENT
  ========================================================= */

  function handleView(student) {
    const studentId =
      student._id || student.id;

    if (!studentId) {
      setError(
        "Cannot open student details because the student ID is missing."
      );
      return;
    }

    setError("");

    navigate(
      `/students/${encodeURIComponent(studentId)}`,
      {
        state: { student },
      }
    );
  }

  /* =========================================================
     EDIT STUDENT
  ========================================================= */

  function handleEdit(student) {
    navigate("/add-student", {
      state: {
        student,
        editMode: true,
      },
    });
  }

  /* =========================================================
     DELETE STUDENT
  ========================================================= */

  async function handleDelete(student) {
    const studentId =
      student._id || student.id;

    const studentName =
      student.fullName ||
      student.name ||
      "this student";

    if (!studentId || deletingId) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${studentName}?`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(studentId);
    setError("");

    try {
      await apiRequest(
        `/students/${studentId}`,
        {
          method: "DELETE",
        }
      );

      setStudents((previous) =>
        previous.filter(
          (item) =>
            String(item._id || item.id) !==
            String(studentId)
        )
      );

      window.dispatchEvent(
        new Event("students-updated")
      );
    } catch (err) {
      console.error(
        "Delete student error:",
        err
      );

      setError(
        err.message ||
          "Unable to delete student."
      );
    } finally {
      setDeletingId(null);
    }
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <section className="students-page">

      {/* ================= TOOLBAR ================= */}

      <div className="students-toolbar">

        <label className="students-search">
          <Search size={18} />

          <input
            type="search"
            placeholder="Search by name, email or course..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </label>

        <select
          aria-label="Filter by course"
          value={courseFilter}
          onChange={(event) => {
            setCourseFilter(event.target.value);
            setPage(1);
          }}
        >
          <option value="All Courses">
            All Courses
          </option>

          {courses.map((course) => (
            <option
              key={course}
              value={course}
            >
              {course}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter by status"
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value);
            setPage(1);
          }}
        >
          <option value="All Status">
            All Status
          </option>

          <option value="New">New</option>
          <option value="Active">Active</option>
          <option value="Inactive">
            Inactive
          </option>
        </select>

        <button
          type="button"
          className="students-add-button"
          onClick={() =>
            navigate("/add-student")
          }
        >
          <Plus size={18} />
          <span>Add Student</span>
        </button>

      </div>

      {/* ================= HEADING ================= */}

      <div className="students-heading">

        <div>
          <h1>Students</h1>

          <p>
            Manage and view all registered students.
          </p>
        </div>

        <span className="students-count">
          <Users size={17} />

          {filteredStudents.length}{" "}
          {filteredStudents.length === 1
            ? "student"
            : "students"}
        </span>

      </div>

      {/* ================= ERROR ================= */}

      {error && (
        <p
          className="alert error"
          role="alert"
        >
          {error}
        </p>
      )}

      {/* ================= TABLE ================= */}

      <div className="students-table-card">

        <div className="students-table-scroll">

          <table className="students-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>COURSE</th>
                <th>YEAR</th>
                <th>DEPARTMENT</th>
                <th>STATUS</th>
                <th className="students-actions-header">
                  ACTIONS
                </th>
              </tr>
            </thead>

            <tbody>

              {/* LOADING */}

              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    className="students-empty"
                  >
                    <div className="students-loading">
                      <span className="loading-spinner"></span>
                      Loading students...
                    </div>
                  </td>
                </tr>

              /* EMPTY */

              ) : visibleStudents.length === 0 ? (

                <tr>
                  <td
                    colSpan="8"
                    className="students-empty"
                  >
                    <div className="empty-state">
                      <Users size={32} />
                      <strong>
                        No students found
                      </strong>
                      <span>
                        Try changing your search
                        or filter.
                      </span>
                    </div>
                  </td>
                </tr>

              /* STUDENTS */

              ) : (

                visibleStudents.map(
                  (student, index) => {
                    const status =
                      getStudentStatus(student);

                    const studentId =
                      student._id ||
                      student.id ||
                      student.studentId ||
                      index;

                    const displayName =
                      student.fullName ||
                      student.name ||
                      "—";

                    return (
                      <tr key={studentId}>

                        {/* ID */}

                        <td>
                          <strong className="student-id">
                            {student.studentId ||
                              student.rollNumber ||
                              index + 1}
                          </strong>
                        </td>

                        {/* NAME */}

                        <td>
                          <div className="student-name-cell">
                            <div className="student-avatar-small">
                              {displayName
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <span>
                              {displayName}
                            </span>
                          </div>
                        </td>

                        {/* EMAIL */}

                        <td>
                          <span className="student-email">
                            {student.email || "—"}
                          </span>
                        </td>

                        {/* COURSE */}

                        <td>
                          {student.course || "—"}
                        </td>

                        {/* YEAR */}

                        <td>
                          {student.year || "—"}
                        </td>

                        {/* DEPARTMENT */}

                        <td>
                          {student.department || "—"}
                        </td>

                        {/* STATUS */}

                        <td>
                          <span
                            className={`student-status ${getStatusClass(
                              status
                            )}`}
                          >
                            <span className="status-dot"></span>
                            {status}
                          </span>
                        </td>

                        {/* ACTIONS */}

                        <td className="students-actions-cell">

                          <div className="student-action-buttons">

                            <button
                              type="button"
                              className="student-action view"
                              title="View student details"
                              aria-label={`View details for ${displayName}`}
                              onClick={() =>
                                handleView(student)
                              }
                            >
                              <Eye size={16} />
                            </button>

                            <button
                              type="button"
                              className="student-action edit"
                              title="Edit student"
                              aria-label="Edit student"
                              onClick={() =>
                                handleEdit(student)
                              }
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              type="button"
                              className="student-action delete"
                              title="Delete student"
                              aria-label="Delete student"
                              disabled={
                                String(
                                  deletingId
                                ) ===
                                String(
                                  student._id ||
                                    student.id
                                )
                              }
                              onClick={() =>
                                handleDelete(student)
                              }
                            >
                              <Trash2 size={16} />
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )
              )}

            </tbody>

          </table>

        </div>

        {/* ================= PAGINATION ================= */}

        <div className="students-pagination">

          <span>
            Showing{" "}
            {filteredStudents.length === 0
              ? 0
              : (currentPage - 1) *
                  pageSize +
                1}
            {"–"}
            {Math.min(
              currentPage * pageSize,
              filteredStudents.length
            )}
            {" of "}
            {filteredStudents.length}{" "}
            {filteredStudents.length === 1
              ? "student"
              : "students"}
          </span>

          <div>

            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() =>
                setPage((previous) =>
                  Math.max(
                    1,
                    previous - 1
                  )
                )
              }
            >
              Previous
            </button>

            <span className="page-number">
              {currentPage}
            </span>

            <button
              type="button"
              disabled={
                currentPage >= totalPages
              }
              onClick={() =>
                setPage((previous) =>
                  Math.min(
                    totalPages,
                    previous + 1
                  )
                )
              }
            >
              Next
            </button>

          </div>

        </div>

      </div>

    </section>
  );
}