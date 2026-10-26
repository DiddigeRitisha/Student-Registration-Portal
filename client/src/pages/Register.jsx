
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import PortalLogo from "../components/PortalLogo";

function CustomSelect({
  id,
  name,
  value,
  onChange,
  options,
  placeholder,
  required = false,
}) {
  const [open, setOpen] = useState(false);

  const selected = options.find(
    (option) => option.value === value
  );

  function chooseOption(optionValue) {
    onChange({
      target: {
        name,
        value: optionValue,
      },
    });

    setOpen(false);
  }

  return (
    <div className="custom-select-wrapper">
      <button
        type="button"
        id={id}
        className="custom-select-button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((previous) => !previous)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setOpen(false);
          }

          if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        <span>
          {selected ? selected.label : placeholder}
        </span>

        <svg
          className={`custom-select-chevron ${
            open ? "rotated" : ""
          }`}
          viewBox="0 0 24 24"
          width="13"
          height="13"
          aria-hidden="true"
        >
          <path
            d="m6 9 6 6 6-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <>
          <button
            type="button"
            className="custom-select-dismiss"
            aria-label="Close dropdown"
            onClick={() => setOpen(false)}
          />

          <div className="custom-select-menu" role="listbox">
            {options.map((option) => (
              <button
                type="button"
                key={option.value}
                className={`custom-select-option ${
                  value === option.value ? "selected" : ""
                }`}
                role="option"
                aria-selected={value === option.value}
                onClick={() => chooseOption(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    studentId: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    course: "",
    department: "",
    academicYear: "",
    semester: "",
    password: "",
  });

  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function submit(event) {
    event.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (form.password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const studentDetails = {
        name: form.name.trim(),
        email: form.email.trim(),
        studentId: form.studentId.trim(),
        phone: form.phone.trim(),
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
        address: form.address.trim(),
        course: form.course,
        department: form.department.trim(),
        academicYear: form.academicYear,
        semester: form.semester,
      };

      await register(
        studentDetails.name,
        studentDetails.email,
        form.password,
        studentDetails
      );

      navigate("/dashboard");
    } catch (err) {
      setError(err?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="portal-auth-page">
      <div className="portal-auth-card register-card">
        <div className="portal-auth-header">
          <PortalLogo />
          <div className="portal-title">
            Student Registration Portal
          </div>
        </div>

        <div className="portal-auth-heading">
          <p className="portal-eyebrow">CREATE ACCOUNT</p>
          <h1>REGISTER</h1>
          <p className="portal-description">
            Enter your personal and academic details.
          </p>
        </div>

        {error && (
          <div className="portal-message error" role="alert">
            {error}
          </div>
        )}

        <form className="portal-form" onSubmit={submit}>
          {/* Personal Information */}
          <h3 className="register-section-title">
            Personal Information
          </h3>

          <div className="portal-field">
            <label htmlFor="reg-name">
              Full Name <span className="required-star">*</span>
            </label>
            <div className="portal-input">
              <input
                id="reg-name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                minLength={2}
                required
              />
            </div>
          </div>

          <div className="portal-field">
            <label htmlFor="reg-email">
              Email <span className="required-star">*</span>
            </label>
            <div className="portal-input">
              <input
                id="reg-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="portal-field">
            <label htmlFor="reg-phone">
              Phone Number{" "}
              <span className="required-star">*</span>
            </label>
            <div className="portal-input">
              <input
                id="reg-phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                autoComplete="tel"
                pattern="[0-9]{10}"
                title="Enter a 10-digit phone number"
                required
              />
            </div>
          </div>

          <div className="portal-field">
            <label htmlFor="reg-dob">Date of Birth</label>
            <div className="portal-input">
              <input
                id="reg-dob"
                name="dateOfBirth"
                type="date"
                value={form.dateOfBirth}
                onChange={handleChange}
                autoComplete="bday"
              />
            </div>
          </div>

          <div className="portal-field">
            <label htmlFor="reg-gender">Gender</label>
            <div className="portal-input">
              <CustomSelect
                id="reg-gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                placeholder="Select gender"
                options={[
                  { value: "Female", label: "Female" },
                  { value: "Male", label: "Male" },
                  { value: "Other", label: "Other" },
                  {
                    value: "Prefer not to say",
                    label: "Prefer not to say",
                  },
                ]}
              />
            </div>
          </div>

          <div className="portal-field">
            <label htmlFor="reg-address">Address</label>
            <div className="portal-input">
              <textarea
                id="reg-address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter your complete address"
                rows={3}
                autoComplete="street-address"
              />
            </div>
          </div>

          {/* Academic Information */}
          <h3 className="register-section-title">
            Academic Information
          </h3>

          <div className="portal-field">
            <label htmlFor="reg-studentId">
              Student ID <span className="required-star">*</span>
            </label>
            <div className="portal-input">
              <input
                id="reg-studentId"
                name="studentId"
                type="text"
                value={form.studentId}
                onChange={handleChange}
                placeholder="Example: STU1001"
                pattern="STU[0-9]{4,}"
                title="Use an ID such as STU1001"
                required
              />
            </div>
          </div>

          <div className="portal-field">
            <label htmlFor="reg-course">
              Course <span className="required-star">*</span>
            </label>
            <div className="portal-input">
              <CustomSelect
                id="reg-course"
                name="course"
                value={form.course}
                onChange={handleChange}
                placeholder="Select course"
                required
                options={[
                  { value: "B.Tech", label: "B.Tech" },
                  { value: "B.E.", label: "B.E." },
                  { value: "B.Sc", label: "B.Sc" },
                  { value: "B.Com", label: "B.Com" },
                  { value: "BBA", label: "BBA" },
                  { value: "M.Tech", label: "M.Tech" },
                  { value: "M.Sc", label: "M.Sc" },
                  { value: "MBA", label: "MBA" },
                  { value: "Other", label: "Other" },
                ]}
              />
            </div>
          </div>

          <div className="portal-field">
            <label htmlFor="reg-department">
              Department <span className="required-star">*</span>
            </label>
            <div className="portal-input">
              <input
                id="reg-department"
                name="department"
                type="text"
                value={form.department}
                onChange={handleChange}
                placeholder="Example: Computer Science"
                required
              />
            </div>
          </div>

          <div className="portal-field">
            <label htmlFor="reg-academicYear">
              Academic Year{" "}
              <span className="required-star">*</span>
            </label>
            <div className="portal-input">
              <CustomSelect
                id="reg-academicYear"
                name="academicYear"
                value={form.academicYear}
                onChange={handleChange}
                placeholder="Select academic year"
                required
                options={[
                  { value: "1", label: "First Year" },
                  { value: "2", label: "Second Year" },
                  { value: "3", label: "Third Year" },
                  { value: "4", label: "Fourth Year" },
                ]}
              />
            </div>
          </div>

          <div className="portal-field">
            <label htmlFor="reg-semester">
              Semester <span className="required-star">*</span>
            </label>
            <div className="portal-input">
              <CustomSelect
                id="reg-semester"
                name="semester"
                value={form.semester}
                onChange={handleChange}
                placeholder="Select semester"
                required
                options={[
                  { value: "1", label: "Semester 1" },
                  { value: "2", label: "Semester 2" },
                  { value: "3", label: "Semester 3" },
                  { value: "4", label: "Semester 4" },
                  { value: "5", label: "Semester 5" },
                  { value: "6", label: "Semester 6" },
                  { value: "7", label: "Semester 7" },
                  { value: "8", label: "Semester 8" },
                ]}
              />
            </div>
          </div>

          {/* Account Security */}
          <h3 className="register-section-title">
            Account Security
          </h3>

          <div className="portal-field">
            <label htmlFor="reg-password">
              Password <span className="required-star">*</span>
            </label>

            <div className="portal-input password-input-wrapper">
              <input
                id="reg-password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Create a password"
                autoComplete="new-password"
                minLength={8}
                required
              />

              <button
                type="button"
                className="password-toggle-button"
                onClick={() =>
                  setShowPassword((previous) => !previous)
                }
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
                title={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={18} strokeWidth={2} />
                ) : (
                  <Eye size={18} strokeWidth={2} />
                )}
              </button>
            </div>
          </div>

          <div className="portal-field">
            <label htmlFor="reg-confirm">
              Confirm Password{" "}
              <span className="required-star">*</span>
            </label>

            <div className="portal-input password-input-wrapper">
              <input
                id="reg-confirm"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
                placeholder="Confirm your password"
                autoComplete="new-password"
                minLength={8}
                required
              />

              <button
                type="button"
                className="password-toggle-button"
                onClick={() =>
                  setShowConfirmPassword((previous) => !previous)
                }
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                title={
                  showConfirmPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} strokeWidth={2} />
                ) : (
                  <Eye size={18} strokeWidth={2} />
                )}
              </button>
            </div>
          </div>

          <button
            className="portal-primary-button"
            disabled={loading}
            type="submit"
          >
            {loading ? "CREATING..." : "CREATE ACCOUNT"}
          </button>
        </form>

        <div className="portal-auth-links">
          Already registered? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
