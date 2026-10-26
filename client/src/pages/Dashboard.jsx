import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Users,
  UserCheck,
  UserPlus,
  UserRoundX,
  BookOpen,
  Plus,
  Eye,
  Download,
  FileText,
  Search,
  RefreshCw,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

function getStatus(student) {
  const rawStatus = String(
    student?.status ?? student?.studentStatus ?? ""
  )
    .trim()
    .toLowerCase();

  if (
    student?.isActive === false ||
    ["inactive", "in-active", "disabled"].includes(rawStatus)
  ) {
    return "Inactive";
  }

  if (["new", "pending"].includes(rawStatus)) {
    return "New";
  }

  if (
    student?.isActive === true ||
    ["active", "approved"].includes(rawStatus)
  ) {
    return "Active";
  }

  return rawStatus
    ? rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1)
    : "New";
}

function getRegistrationDate(student) {
  return (
    student?.createdAt ||
    student?.created_at ||
    student?.registrationDate ||
    student?.registeredAt ||
    student?.dateCreated ||
    null
  );
}

function formatDate(student) {
  const value = getRegistrationDate(student);

  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function isRegisteredToday(student) {
  const value = getRegistrationDate(student);

  if (!value) return false;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return false;

  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

function getStudentName(student) {
  return (
    student?.fullName ||
    student?.name ||
    student?.studentName ||
    "—"
  );
}

function getStudentKey(student, index) {
  return (
    student?._id ||
    student?.id ||
    student?.studentId ||
    student?.email ||
    index
  );
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color,
  loading,
}) {
  return (
    <article className="dashboard-stat-card">
      <div className="dashboard-stat-content">
        <span className="dashboard-stat-title">{title}</span>

        <strong className="dashboard-stat-number">
          {loading ? "—" : value}
        </strong>

        <span className="dashboard-stat-description">
          {description}
        </span>
      </div>

      <div
        className={`dashboard-stat-icon ${color}`}
        aria-hidden="true"
      >
        <Icon size={24} strokeWidth={1.9} />
      </div>
    </article>
  );
}

function QuickAction({
  icon: Icon,
  children,
  onClick,
  primary = false,
  disabled = false,
}) {
  return (
    <button
      type="button"
      className={`quick-action ${primary ? "primary" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon size={19} strokeWidth={2} aria-hidden="true" />
      <span>{children}</span>
      <ArrowUpRight
        className="quick-action-arrow"
        size={16}
        strokeWidth={1.8}
        aria-hidden="true"
      />
    </button>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [recentSearch, setRecentSearch] = useState("");

  const loadStudents = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }

        setError("");

        const response = await apiRequest("/students");

        const list = Array.isArray(response)
          ? response
          : Array.isArray(response?.students)
          ? response.students
          : Array.isArray(response?.data?.students)
          ? response.data.students
          : Array.isArray(response?.data?.data)
          ? response.data.data
          : Array.isArray(response?.data)
          ? response.data
          : null;

        if (!list) {
          throw new Error(
            "The server response does not contain a valid student list."
          );
        }

        setStudents(list);
      } catch (err) {
        console.error("Dashboard students error:", err);

        setError(
          err?.message || "Unable to load student records."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    loadStudents();

    const handleRefresh = () => {
      loadStudents(false);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadStudents(false);
      }
    };

    window.addEventListener("students-updated", handleRefresh);
    window.addEventListener("focus", handleRefresh);

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    const refreshInterval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        loadStudents(false);
      }
    }, 15000);

    return () => {
      window.removeEventListener(
        "students-updated",
        handleRefresh
      );

      window.removeEventListener("focus", handleRefresh);

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

      window.clearInterval(refreshInterval);
    };
  }, [loadStudents]);

  const totalStudents = students.length;

  const activeStudents = useMemo(
    () =>
      students.filter(
        (student) => getStatus(student) === "Active"
      ).length,
    [students]
  );

  const inactiveStudents = useMemo(
    () =>
      students.filter(
        (student) => getStatus(student) === "Inactive"
      ).length,
    [students]
  );

  const newRegistrations = useMemo(
    () =>
      students.filter(
        (student) =>
          getStatus(student) === "New" ||
          isRegisteredToday(student)
      ).length,
    [students]
  );

  const totalCourses = useMemo(() => {
    const courses = students
      .map((student) =>
        String(student?.course || "").trim().toLowerCase()
      )
      .filter(Boolean);

    return new Set(courses).size;
  }, [students]);

  const recentRegistrations = useMemo(() => {
    const term = recentSearch.trim().toLowerCase();

    return students
      .filter((student) => {
        if (!term) return true;

        return [
          student?.studentId,
          student?.rollNumber,
          student?.fullName,
          student?.name,
          student?.studentName,
          student?.email,
          student?.course,
          student?.department,
        ].some((value) =>
          String(value || "").toLowerCase().includes(term)
        );
      })
      .sort((a, b) => {
        const dateA = new Date(
          getRegistrationDate(a) || 0
        ).getTime();

        const dateB = new Date(
          getRegistrationDate(b) || 0
        ).getTime();

        return dateB - dateA;
      })
      .slice(0, 5);
  }, [students, recentSearch]);

  function exportData() {
    if (!students.length) {
      window.alert("There are no student records to export.");
      return;
    }

    const headers = [
      "Student ID",
      "Name",
      "Email",
      "Phone",
      "Date of Birth",
      "Address",
      "Course",
      "Academic Year",
      "Semester",
      "Department",
      "Gender",
      "Status",
    ];

    const rows = students.map((student) => [
      student?.studentId || student?.rollNumber || "",
      getStudentName(student),
      student?.email || "",
      student?.phone || student?.phoneNumber || "",
      student?.dateOfBirth || student?.dob || "",
      student?.address || "",
      student?.course || "",
      student?.academicYear || student?.year || "",
      student?.semester || "",
      student?.department || "",
      student?.gender || "",
      getStatus(student),
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value ?? "").replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "student-records.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    // Delay revocation to allow the browser to start downloading.
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <section className="dashboard-page">
      {/* Dashboard heading */}
      <div className="dashboard-welcome">
        <div>
          <h1>Welcome, Admin!</h1>
          <p>
            Here's what's happening with your portal today.
          </p>
        </div>

        <button
          type="button"
          className="dashboard-refresh-button"
          onClick={() => loadStudents(false)}
          disabled={refreshing}
          aria-label="Refresh dashboard"
          title="Refresh dashboard"
        >
          <RefreshCw
            size={18}
            className={refreshing ? "is-spinning" : ""}
          />
          <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="dashboard-error" role="alert">
          <AlertCircle size={19} />
          <span>{error}</span>

          <button
            type="button"
            onClick={() => loadStudents()}
            className="dashboard-error-retry"
          >
            Try again
          </button>
        </div>
      )}

      {/* Statistics */}
      <section
        className="dashboard-stats"
        aria-label="Student statistics"
      >
        <StatCard
          title="Total Students"
          value={totalStudents}
          description="All registered students"
          icon={Users}
          color="total-icon"
          loading={loading}
        />

        <StatCard
          title="Active Students"
          value={activeStudents}
          description="Currently active"
          icon={UserCheck}
          color="active-icon"
          loading={loading}
        />

        <StatCard
          title="New Registrations"
          value={newRegistrations}
          description="Registered today or marked New"
          icon={UserPlus}
          color="new-icon"
          loading={loading}
        />

        <StatCard
          title="Inactive Students"
          value={inactiveStudents}
          description="Currently inactive"
          icon={UserRoundX}
          color="inactive-icon"
          loading={loading}
        />

        <StatCard
          title="Total Courses"
          value={totalCourses}
          description="Unique courses"
          icon={BookOpen}
          color="course-icon"
          loading={loading}
        />
      </section>

      {/* Recent registrations and quick actions */}
      <section className="dashboard-bottom">
        <div className="recent-registrations-card">
          <div className="dashboard-section-header">
            <div>
              <h2>Recent Registrations</h2>
              <p>
                View and manage newly registered students.
              </p>
            </div>

            <button
              type="button"
              className="dashboard-view-all"
              onClick={() => navigate("/students")}
            >
              View All
              <ArrowUpRight size={16} />
            </button>
          </div>

          {/* Search */}
          <div className="recent-search">
            <Search size={18} aria-hidden="true" />

            <input
              type="search"
              value={recentSearch}
              placeholder="Search ID, name, email or course..."
              aria-label="Search recent registrations"
              onChange={(event) =>
                setRecentSearch(event.target.value)
              }
            />

            {recentSearch && (
              <button
                type="button"
                className="recent-search-clear"
                onClick={() => setRecentSearch("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* Students table */}
          <div className="recent-table-wrapper">
            <table className="recent-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="dashboard-empty">
                      <RefreshCw
                        size={17}
                        className="is-spinning"
                      />
                      <span>Loading registrations...</span>
                    </td>
                  </tr>
                ) : recentRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="dashboard-empty">
                      <Users size={22} />
                      <span>
                        {recentSearch
                          ? "No matching students found."
                          : "No student registrations found."}
                      </span>
                    </td>
                  </tr>
                ) : (
                  recentRegistrations.map((student, index) => {
                    const status = getStatus(student);

                    const statusClass =
                      status === "Active"
                        ? "recent-status-active"
                        : status === "New"
                        ? "recent-status-new"
                        : status === "Inactive"
                        ? "recent-status-inactive"
                        : "";

                    return (
                      <tr key={getStudentKey(student, index)}>
                        <td>
                          <div className="recent-student-name">
                            {getStudentName(student)}
                          </div>
                        </td>

                        <td>{student?.email || "—"}</td>
                        <td>{student?.course || "—"}</td>
                        <td>{formatDate(student)}</td>

                        <td>
                          <span
                            className={`recent-status ${statusClass}`}
                          >
                            <span className="recent-status-dot" />
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick actions */}
        <aside className="quick-actions-card">
          <div className="dashboard-section-header">
            <div>
              <h2>Quick Actions</h2>
              <p>Common portal actions.</p>
            </div>
          </div>

          <div className="quick-actions-list">
            <QuickAction
              icon={Plus}
              primary
              onClick={() => navigate("/add-student")}
            >
              Add New Student
            </QuickAction>

            <QuickAction
              icon={Eye}
              onClick={() => navigate("/students")}
            >
              View All Students
            </QuickAction>

            <QuickAction
              icon={Download}
              onClick={exportData}
            >
              Export Data
            </QuickAction>

            <QuickAction
              icon={FileText}
              onClick={() => navigate("/reports")}
            >
              View Reports
            </QuickAction>
          </div>
        </aside>
      </section>
    </section>
  );
}