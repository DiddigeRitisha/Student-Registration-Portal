import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PortalLogo from "../components/PortalLogo";

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect
        x="3" y="5" width="18" height="14" rx="2"
        fill="none" stroke="currentColor" strokeWidth="2"
      />
      <path
        d="m4 7 8 6 8-6"
        fill="none" stroke="currentColor" strokeWidth="2"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect
        x="5" y="10" width="14" height="11" rx="2"
        fill="none" stroke="currentColor" strokeWidth="2"
      />
      <path
        d="M8 10V7a4 4 0 0 1 8 0v3"
        fill="none" stroke="currentColor" strokeWidth="2"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3 20 6v5c0 5-3.2 8.4-8 10-4.8-1.6-8-5-8-10V6l8-3Z"
        fill="none" stroke="currentColor" strokeWidth="2"
      />
      <path
        d="m8.5 12 2.2 2.2 4.8-5"
        fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M20 11a8 8 0 0 0-14-4L4 9"
        fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M4 5v4h4"
        fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M4 13a8 8 0 0 0 14 4l2-2"
        fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M20 19v-4h-4"
        fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function generateCaptcha() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  return Array.from(
    { length: 6 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    securityCode: "",
  });

  const [captcha, setCaptcha] = useState(generateCaptcha);
  const [accepted, setAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function refreshCaptcha() {
    setCaptcha(generateCaptcha());
    setForm((previous) => ({
      ...previous,
      securityCode: "",
    }));
  }

  async function submit(event) {
    event.preventDefault();
    setError("");

    if (form.securityCode.trim().toUpperCase() !== captcha) {
      setError("Please enter the correct security code.");
      refreshCaptcha();
      return;
    }

    if (!accepted) {
      setError("Please confirm that you have read the instructions.");
      return;
    }

    setLoading(true);

    try {
      await login(form.email.trim(), form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="portal-auth-page">
      <div className="portal-auth-card portal-login-card">
        <div className="portal-auth-header">
          <PortalLogo />
          <div className="portal-title">
            Student Registration Portal
          </div>
        </div>

        <div className="portal-auth-heading">
          <p className="portal-eyebrow">WELCOME BACK</p>
          <h1>SIGN IN</h1>
        </div>

        {error && (
          <div className="portal-message error" role="alert">
            {error}
          </div>
        )}

        <form className="portal-form" onSubmit={submit}>
          {/* Email */}
          <div className="portal-field">
            <label htmlFor="login-email">
              <span className="field-label">
                <MailIcon />
                Email<span className="required-star">*</span>
              </span>
            </label>

            <div className="portal-input">
              <input
                id="login-email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                placeholder="Enter your email"
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="portal-field">
            <label htmlFor="login-password">
              <span className="field-label">
                <LockIcon />
                Password<span className="required-star">*</span>
              </span>
            </label>

            <div className="portal-input">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="eye-button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {/* Security Code */}
          <div className="portal-field captcha-field">
            <label>
              <span className="field-label">
                <ShieldIcon />
                Security Code
              </span>
            </label>

            <div className="captcha-row">
              <div className="captcha-code" aria-label="Security code">
                {captcha.split("").map((char, index) => (
                  <span key={`${char}-${index}`}>{char}</span>
                ))}
              </div>

              <button
                type="button"
                className="captcha-refresh"
                onClick={refreshCaptcha}
                aria-label="Refresh security code"
              >
                <RefreshIcon />
              </button>
            </div>

            <div className="portal-input">
              <ShieldIcon />
              <input
                type="text"
                value={form.securityCode}
                onChange={(e) =>
                  setForm({
                    ...form,
                    securityCode: e.target.value.toUpperCase(),
                  })
                }
                placeholder="Enter security code"
                maxLength={6}
                aria-label="Enter security code"
                required
              />
            </div>
          </div>

          <label className="instruction-check">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
            />
            <span>I have read the instructions</span>
          </label>

          <button
            className="portal-primary-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>

        <div className="portal-auth-links">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>

        <div className="portal-auth-links">
          Don't have an account? <Link to="/register">Create Account</Link>
        </div>
      </div>
    </div>
  );
}