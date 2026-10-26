import { useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";
import PortalLogo from "../components/PortalLogo";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault(); setError(""); setMessage(""); setResetUrl(""); setLoading(true);
    try {
      const data = await apiRequest("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) });
      setMessage(data.message); if (data.resetUrl) setResetUrl(data.resetUrl);
    } catch (err) { setError(err?.message || "Unable to create reset link."); }
    finally { setLoading(false); }
  }

  return (
    <div className="portal-auth-page">
      <div className="portal-auth-card">
        <div className="portal-auth-header"><PortalLogo /><div className="portal-title">Student Registration Portal</div></div>
        <div className="portal-auth-heading"><p className="portal-eyebrow">ACCOUNT RECOVERY</p><h1>FORGOT PASSWORD?</h1><p className="portal-description">Enter your registered email to create a password reset link.</p></div>
        {error && <div className="portal-message error">{error}</div>}
        {message && <div className="portal-message success">{message}</div>}
        <form className="portal-form" onSubmit={submit}>
          <div className="portal-field"><label htmlFor="forgot-email">Email</label><div className="portal-input"><input id="forgot-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required /></div></div>
          <button className="portal-primary-button" disabled={loading} type="submit">{loading ? "SENDING..." : "SEND RESET LINK"}</button>
        </form>
        {resetUrl && <div className="dev-reset"><strong>Local development reset link</strong><Link to={resetUrl.replace(window.location.origin, "")}>Open password reset</Link></div>}
        <div className="portal-auth-links"><Link to="/login">Back to Sign In</Link></div>
      </div>
    </div>
  );
}
