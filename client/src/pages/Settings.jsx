
import { useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";

function Toggle({ title, description, checked, onChange }) {
  return (
    <div className="settings-row">
      <div className="settings-row-content">
        <h4>{title}</h4>
        <p>{description}</p>
      </div>

      <label className="settings-switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          aria-label={title}
        />
        <span className="settings-slider" />
      </label>
    </div>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  visible,
  onToggle,
  minLength,
}) {
  return (
    <div className="settings-password-field">
      <label htmlFor={id} className="password-label-text">
        <span>{label}</span>
        <span className="required-star" aria-hidden="true">
          *
        </span>
      </label>

      <div className="settings-password-input">
        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          minLength={minLength}
          required
        />

        <button
          type="button"
          className="settings-password-toggle"
          onClick={onToggle}
          aria-label={visible ? `Hide ${label}` : `Show ${label}`}
          aria-pressed={visible}
          title={visible ? "Hide password" : "Show password"}
        >
          {visible ? (
            <EyeOff size={17} strokeWidth={1.9} />
          ) : (
            <Eye size={17} strokeWidth={1.9} />
          )}
        </button>
      </div>
    </div>
  );
}

export default function Settings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  function handlePasswordSubmit(event) {
    event.preventDefault();
    setMessage("");
    setMessageType("info");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage("Please fill in all required fields.");
      setMessageType("error");
      return;
    }

    if (newPassword.length < 8) {
      setMessage("New password must be at least 8 characters.");
      setMessageType("error");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      setMessageType("error");
      return;
    }

    if (currentPassword === newPassword) {
      setMessage(
        "Your new password must differ from your current password."
      );
      setMessageType("error");
      return;
    }

    setMessage(
      "Form validated. Connect your backend password-change API to save the password."
    );
    setMessageType("info");
  }

  return (
    <div className={`settings-page ${darkMode ? "settings-dark" : ""}`}>
      <h1>Settings</h1>

      <p className="settings-description">
        Manage your account settings and preferences.
      </p>

      {/* Account Settings */}
      <section className="settings-card">
        <h3>Account Settings</h3>

        <Toggle
          title="Email Notifications"
          description="Receive email updates about your account and activities."
          checked={emailNotifications}
          onChange={setEmailNotifications}
        />

        <Toggle
          title="Profile Visibility"
          description="Make your profile visible to other students."
          checked={profileVisibility}
          onChange={setProfileVisibility}
        />

        <Toggle
          title="Dark Mode"
          description="Switch between light and dark mode."
          checked={darkMode}
          onChange={setDarkMode}
        />
      </section>

      {/* Change Password */}
      <section className="settings-card">
        <h3>Change Password</h3>

        <form onSubmit={handlePasswordSubmit}>
          <div className="settings-password-grid">
            <PasswordField
              id="currentPassword"
              label="Current Password"
              value={currentPassword}
              onChange={(event) =>
                setCurrentPassword(event.target.value)
              }
              placeholder="Enter current password"
              autoComplete="current-password"
              visible={showCurrentPassword}
              onToggle={() =>
                setShowCurrentPassword((previous) => !previous)
              }
            />

            <PasswordField
              id="newPassword"
              label="New Password"
              value={newPassword}
              onChange={(event) =>
                setNewPassword(event.target.value)
              }
              placeholder="Enter new password"
              autoComplete="new-password"
              visible={showNewPassword}
              onToggle={() =>
                setShowNewPassword((previous) => !previous)
              }
              minLength={8}
            />

            <PasswordField
              id="confirmPassword"
              label="Confirm Password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              placeholder="Confirm new password"
              autoComplete="new-password"
              visible={showConfirmPassword}
              onToggle={() =>
                setShowConfirmPassword((previous) => !previous)
              }
              minLength={8}
            />
          </div>

          {message && (
            <p
              className={`settings-message ${messageType}`}
              role={messageType === "error" ? "alert" : "status"}
            >
              {message}
            </p>
          )}

          <button
            className="settings-update-button"
            type="submit"
          >
            <LockKeyhole size={15} />
            <span>Update Password</span>
          </button>
        </form>
      </section>
    </div>
  );
}
