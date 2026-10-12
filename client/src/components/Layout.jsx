import {
  NavLink,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  UserPlus,
  UserRound,
  Settings as SettingsIcon,
  LogOut,
  Search,
  Bell,
  GraduationCap,
  X,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

const navigation = [
  {
    to: "/dashboard",
    label: "Dashboard",
    Icon: LayoutDashboard,
  },
  {
    to: "/students",
    label: "Students",
    Icon: Users,
  },
  {
    to: "/add-student",
    label: "Add Student",
    Icon: UserPlus,
  },
  {
    to: "/profile",
    label: "My Profile",
    Icon: UserRound,
  },
  {
    to: "/settings",
    label: "Settings",
    Icon: SettingsIcon,
    end: true,
  },
];

export default function Layout() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const showSearch = location.pathname === "/dashboard";

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [hasUnreadNotification, setHasUnreadNotification] =
    useState(true);

  // =========================================================
  // PROFILE PICTURE
  // =========================================================

  // The profile picture now comes directly from the logged-in
  // user stored in AuthContext/MongoDB.
  const profilePicture = user?.profilePicture || "";

  // =========================================================
  // CLOSE NOTIFICATIONS WHEN PAGE CHANGES
  // =========================================================

  useEffect(() => {
    setShowNotifications(false);
  }, [location.pathname]);

  // =========================================================
  // LOGOUT
  // =========================================================

  function handleLogout() {
    logout();
    navigate("/login");
  }

  // =========================================================
  // NOTIFICATIONS
  // =========================================================

  function toggleNotifications() {
    const willOpen = !showNotifications;

    setShowNotifications(willOpen);

    if (willOpen) {
      setHasUnreadNotification(false);
    }
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="portal-shell">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="portal-sidebar">

        <div className="sidebar-brand">
          <GraduationCap size={30} />
          <strong>Student Portal</strong>
        </div>

        <nav
          className="sidebar-navigation"
          aria-label="Main navigation"
        >
          {navigation.map(
            ({ to, label, Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `sidebar-link ${
                    isActive ? "active" : ""
                  }`
                }
              >
                <Icon
                  size={19}
                  aria-hidden="true"
                />

                <span>{label}</span>
              </NavLink>
            )
          )}
        </nav>

        <button
          type="button"
          className="sidebar-link sidebar-logout"
          onClick={handleLogout}
        >
          <LogOut
            size={19}
            aria-hidden="true"
          />

          <span>Logout</span>
        </button>
      </aside>

      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <div className="portal-main">

        {/* ===================================================
            TOP BAR
        =================================================== */}

        <header className="portal-topbar">

          {/* Dashboard Search */}
          {showSearch && (
            <label className="portal-search">
              <Search size={18} />

              <input
                type="search"
                placeholder="Search students..."
                aria-label="Search students"
              />
            </label>
          )}

          {/* ===============================================
              USER AREA
          =============================================== */}

          <div className="topbar-user">

            {/* ---------------------------------------------
                NOTIFICATIONS
            --------------------------------------------- */}

            <div className="notification-container">

              <button
                type="button"
                className="icon-button notification-bell"
                aria-label={
                  hasUnreadNotification
                    ? "Notifications, unread"
                    : "Notifications"
                }
                title="Notifications"
                aria-expanded={
                  showNotifications
                }
                aria-controls="notifications-panel"
                onClick={
                  toggleNotifications
                }
              >
                <Bell size={20} />

                {hasUnreadNotification && (
                  <span
                    className="notification-badge"
                    aria-label="Unread notification"
                  />
                )}
              </button>

              {/* Notification Panel */}
              {showNotifications && (
                <section
                  id="notifications-panel"
                  className="notifications-panel"
                  aria-label="Notifications panel"
                >

                  <div className="notifications-header">

                    <h3>
                      Notifications
                    </h3>

                    <button
                      type="button"
                      className="notifications-close"
                      onClick={() =>
                        setShowNotifications(
                          false
                        )
                      }
                      aria-label="Close notifications"
                    >
                      <X size={18} />
                    </button>

                  </div>

                  <div className="notification-item">

                    <span className="notification-dot" />

                    <div>
                      <strong>
                        Welcome to Student Portal
                      </strong>

                      <p>
                        Your student portal is
                        ready to use.
                      </p>
                    </div>

                  </div>

                  <div className="notifications-footer">
                    You are all caught up!
                  </div>

                </section>
              )}

            </div>

            {/* ---------------------------------------------
                PROFILE AVATAR
            --------------------------------------------- */}

            <button
              type="button"
              className="anime-avatar"
              aria-label="Open profile"
              title="Profile"
              onClick={() =>
                navigate("/profile")
              }
            >

              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="header-profile-image"
                />
              ) : (
                <span className="default-flower">
                  🌸
                </span>
              )}

            </button>

            {/* ---------------------------------------------
                USER NAME
            --------------------------------------------- */}

            <span className="topbar-user-name">
              {user?.name || "Student"}
            </span>

          </div>

        </header>

        {/* ===================================================
            CURRENT PAGE
        =================================================== */}

        <main className="portal-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}