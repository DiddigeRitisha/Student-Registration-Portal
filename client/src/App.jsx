import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Students from "./pages/Students";
import AddStudent from "./pages/AddStudent";
import StudentDetails from "./pages/StudentDetails";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";

export default function App() {
  return (
    <Routes>
      {/* Authentication pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />
      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

      {/* Protected application pages */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* Students list */}
          <Route
            path="/students"
            element={<Students />}
          />

          {/* Individual student details */}
          <Route
            path="/students/:id"
            element={<StudentDetails />}
          />

          {/* Add or edit student */}
          <Route
            path="/add-student"
            element={<AddStudent />}
          />

          {/* Admin profile */}
          <Route
            path="/profile"
            element={<Profile />}
          />

          {/* Settings page */}
          <Route
            path="/settings"
            element={<Settings />}
          />

          {/* Reports page */}
          <Route
            path="/reports"
            element={<Reports />}
          />
        </Route>
      </Route>

      {/* Default page */}
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      {/* Unknown URLs */}
      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
}