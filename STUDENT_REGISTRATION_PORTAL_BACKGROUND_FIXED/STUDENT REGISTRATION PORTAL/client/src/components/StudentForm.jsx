import { useEffect, useState } from "react";

const initial = {
  studentId: "",
  fullName: "",
  email: "",
  phone: "",
  course: "",
  year: 1,
  department: "",
  dateOfBirth: "",
  gender: "Male",
  address: ""
};

export default function StudentForm({ student, onSave, onCancel }) {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");

  useEffect(() => {
    if (student) {
      setForm({
        ...student,
        dateOfBirth: student.dateOfBirth?.slice(0, 10) || ""
      });
    } else {
      setForm(initial);
    }
  }, [student]);

  function update(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  }

  async function submit(event) {
    event.preventDefault();
    setError("");

    try {
      await onSave({
        ...form,
        year: Number(form.year)
      });
      if (!student) setForm(initial);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="student-form" onSubmit={submit}>
      {error && <div className="alert error">{error}</div>}

      <div className="form-grid">
        <label>Student ID
          <input name="studentId" value={form.studentId} onChange={update} placeholder="STU1005" required />
        </label>

        <label>Full Name
          <input name="fullName" value={form.fullName} onChange={update} placeholder="Student full name" required />
        </label>

        <label>Email
          <input type="email" name="email" value={form.email} onChange={update} placeholder="student@example.com" required />
        </label>

        <label>Phone
          <input name="phone" value={form.phone} onChange={update} placeholder="9876543210" required />
        </label>

        <label>Course
          <input name="course" value={form.course} onChange={update} placeholder="B.Tech Computer Science" required />
        </label>

        <label>Year
          <select name="year" value={form.year} onChange={update}>
            {[1, 2, 3, 4, 5, 6].map((year) => <option key={year} value={year}>{year}</option>)}
          </select>
        </label>

        <label>Department
          <input name="department" value={form.department} onChange={update} placeholder="CSE" required />
        </label>

        <label>Date of Birth
          <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={update} required />
        </label>

        <label>Gender
          <select name="gender" value={form.gender} onChange={update}>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </label>

        <label className="full-width">Address
          <textarea name="address" value={form.address} onChange={update} rows="3" placeholder="Address" required />
        </label>
      </div>

      <div className="form-actions">
        <button className="primary" type="submit">{student ? "Update Student" : "Add Student"}</button>
        {student && <button className="secondary" type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
