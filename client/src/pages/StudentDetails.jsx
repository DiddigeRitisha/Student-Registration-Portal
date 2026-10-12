import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, UserRound } from "lucide-react";
import { apiRequest } from "../services/api";

export default function StudentDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [student, setStudent] = useState(location.state?.student || null);
  const [loading, setLoading] = useState(!location.state?.student);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Student ID is missing.");
      setLoading(false);
      return;
    }

    // Load the selected student when opening or refreshing this page.
    apiRequest(`/students/${id}`)
      .then((response) => {
        const data =
          response?.student ||
          response?.data?.student ||
          response?.data;

        if (!data) {
          throw new Error("Student details could not be found.");
        }

        setStudent(data);
      })
      .catch((err) => {
        setError(err.message || "Unable to load student details.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="student-details-page">Loading student details...</div>;
  }

  if (error || !student) {
    return (
      <div className="student-details-page">
        <button onClick={() => navigate("/students")}>
          <ArrowLeft size={16} /> Back to Students
        </button>
        <p>{error || "Student not found."}</p>
      </div>
    );
  }

  const fields = [
    ["Student ID", student.studentId],
    ["Full Name", student.fullName || student.name],
    ["Email", student.email],
    ["Phone", student.phone],
    ["Course", student.course],
    ["Year", student.year],
    ["Department", student.department],
    ["Gender", student.gender],
    ["Date of Birth", student.dateOfBirth],
    ["Address", student.address],
    ["Status", student.status || (student.isActive ? "Active" : "New")],
  ];

  return (
    <div className="student-details-page">
      <button
        type="button"
        className="back-button"
        onClick={() => navigate("/students")}
      >
        <ArrowLeft size={18} /> Back to Students
      </button>

      <div className="student-details-card">
        <div className="student-details-heading">
          <div className="student-details-avatar">
            <UserRound size={30} />
          </div>
          <div>
            <h1>{student.fullName || student.name || "Student Details"}</h1>
            <p>{student.studentId || "Student record"}</p>
          </div>
        </div>

        <h2>Personal & Academic Information</h2>

        <div className="student-details-grid">
          {fields.map(([label, value]) => (
            <div className="student-detail-item" key={label}>
              <span>{label}</span>
              <strong>{value || "Not provided"}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}