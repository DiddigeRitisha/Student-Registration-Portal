import { useEffect, useMemo, useState } from "react";
import {
  Download,
  FileText,
  Users,
  UserCheck,
  UserX,
} from "lucide-react";
import { apiRequest } from "../services/api";

export default function Reports() {
  const [students, setStudents] = useState([]);
  const [reportType, setReportType] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadStudents(showLoading = true) {
    try {
      if (showLoading) setLoading(true);
      setError("");

      const response = await apiRequest("/students");

      const list = Array.isArray(response)
        ? response
        : response?.students ??
          response?.data?.students ??
          response?.data ??
          [];

      if (!Array.isArray(list)) {
        throw new Error("Invalid student records received.");
      }

      setStudents(list);
    } catch (err) {
      console.error("Reports students error:", err);
      setError(err.message || "Unable to load student records.");
    } finally {
      if (showLoading) setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();

    // Refresh after adding, editing, or deleting students.
    const refreshStudents = () => loadStudents(false);

    window.addEventListener("students-updated", refreshStudents);
    window.addEventListener("focus", refreshStudents);

    const interval = window.setInterval(
      () => loadStudents(false),
      15000
    );

    return () => {
      window.removeEventListener("students-updated", refreshStudents);
      window.removeEventListener("focus", refreshStudents);
      window.clearInterval(interval);
    };
  }, []);

  function getStatus(student) {
    const status = String(
      student?.status ?? student?.studentStatus ?? ""
    )
      .trim()
      .toLowerCase();

    if (
      student?.isActive === false ||
      ["inactive", "in-active", "disabled"].includes(status)
    ) {
      return "Inactive";
    }

    if (["active", "approved"].includes(status)) {
      return "Active";
    }

    if (student?.isActive === true) {
      return "Active";
    }

    return "New";
  }

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return students.filter((student) => {
      const status = getStatus(student).toLowerCase();

      const matchesType =
        reportType === "all" || status === reportType;

      const matchesSearch = [
        student.studentId,
        student.rollNumber,
        student.fullName,
        student.name,
        student.email,
        student.course,
        student.department,
        student.status,
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(query)
      );

      return matchesType && matchesSearch;
    });
  }, [students, reportType, search]);

  const activeCount = students.filter(
    (student) => getStatus(student) === "Active"
  ).length;

  const inactiveCount = students.filter(
    (student) => getStatus(student) === "Inactive"
  ).length;

  function exportCSV() {
    if (!filteredStudents.length) {
      alert("There are no student records to export.");
      return;
    }

    const headers = [
      "Student ID",
      "Name",
      "Email",
      "Course",
      "Department",
      "Year",
      "Status",
      "Registration Date",
    ];

    const rows = filteredStudents.map((student) => [
      student.studentId || student.rollNumber || student._id || "",
      student.fullName || student.name || "",
      student.email || "",
      student.course || "",
      student.department || "",
      student.year || "",
      getStatus(student),
      student.createdAt
        ? new Date(student.createdAt).toLocaleDateString("en-IN")
        : "",
    ]);

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "student-report.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="reports-page">
      <div className="reports-heading">
        <div>
          <h1>Reports</h1>
          <p>
            View registered students and export registration reports.
          </p>
        </div>

        <button
          className="reports-export-button"
          onClick={exportCSV}
          type="button"
          disabled={loading || filteredStudents.length === 0}
        >
          <Download size={17} />
          Export CSV
        </button>
      </div>

      {error && (
        <div role="alert" className="reports-error">
          {error}
          <button type="button" onClick={() => loadStudents()}>
            Retry
          </button>
        </div>
      )}

      <div className="reports-summary">
        <div className="reports-stat-card">
          <Users size={22} />
          <span>Total Students</span>
          <strong>{students.length}</strong>
        </div>

        <div className="reports-stat-card">
          <UserCheck size={22} />
          <span>Active Students</span>
          <strong>{activeCount}</strong>
        </div>

        <div className="reports-stat-card">
          <UserX size={22} />
          <span>Inactive Students</span>
          <strong>{inactiveCount}</strong>
        </div>

        <div className="reports-stat-card">
          <FileText size={22} />
          <span>Displayed Records</span>
          <strong>{filteredStudents.length}</strong>
        </div>
      </div>

      <section className="reports-table-card">
        <div className="reports-table-heading">
          <h2>Student Registration Report</h2>

          <input
            type="search"
            placeholder="Search students..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search report"
          />
        </div>

        <div className="reports-filters">
          {[
            { value: "all", label: "All Students" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ].map((filter) => (
            <button
              key={filter.value}
              type="button"
              className={
                reportType === filter.value ? "selected" : ""
              }
              onClick={() => setReportType(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="reports-table-scroll">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Email</th>
                <th>Course</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="reports-empty">
                    Loading student records...
                  </td>
                </tr>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => {
                  const status = getStatus(student);

                  return (
                    <tr
                      key={
                        student._id ||
                        student.studentId ||
                        student.id ||
                        index
                      }
                    >
                      <td>
                        {student.studentId ||
                          student.rollNumber ||
                          "—"}
                      </td>
                      <td>{student.fullName || student.name || "—"}</td>
                      <td>{student.email || "—"}</td>
                      <td>{student.course || "—"}</td>
                      <td>
                        <span
                          className={`report-status ${status.toLowerCase()}`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="reports-empty">
                    {error
                      ? "Unable to load student records."
                      : "No students match your search."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
