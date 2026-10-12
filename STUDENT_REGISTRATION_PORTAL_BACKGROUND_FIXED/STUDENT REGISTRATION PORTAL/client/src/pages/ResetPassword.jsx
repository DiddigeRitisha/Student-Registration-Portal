import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { apiRequest } from "../services/api";
import PortalLogo from "../components/PortalLogo";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("This reset link is missing or invalid.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const data = await apiRequest("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          token,
          password,
        }),
      });

      setSuccess(data.message);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err?.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="portal-auth-page">
      <div className="portal-auth-card">
        <div className="portal-auth-header">
          <PortalLogo />
          <div className="portal-title">
            Student Registration Portal
          </div>
        </div>

        <div className="portal-auth-heading">
          <p className="portal-eyebrow">SECURE YOUR ACCOUNT</p>
          <h1>RESET PASSWORD</h1>
          <p className="portal-description">
            Choose a new password with at least 8 characters.
          </p>
        </div>

        {error && (
          <div className="portal-message error">
            {error}
          </div>
        )}

        {success && (
          <div className="portal-message success">
            {success} Redirecting to sign in...
          </div>
        )}

        <form className="portal-form" onSubmit={submit}>
          <div className="portal-field">
            <label htmlFor="new-password">
              New Password<span className="required-star">*</span>
            </label>

            <div className="portal-input">
              <input
                id="new-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a new password"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>
          </div>

          <div className="portal-field">
            <label htmlFor="confirm-password">
              Confirm Password<span className="required-star">*</span>
            </label>

            <div className="portal-input">
              <input
                id="confirm-password"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirm your password"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>
          </div>

          <button
            className="portal-primary-button"
            disabled={loading}
            type="submit"
          >
            {loading ? "UPDATING..." : "UPDATE PASSWORD"}
          </button>
        </form>

        <div className="portal-auth-links">
          <Link to="/login">Back to Sign In</Link>
        </div>
      </div>
    </div>
  );
}