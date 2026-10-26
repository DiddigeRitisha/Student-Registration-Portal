import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // LOAD CURRENT USER
  // =========================================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    apiRequest("/auth/me")
      .then((data) => {
        setUser(data.user);
      })
      .catch((error) => {
        console.error("Authentication error:", error);

        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // =========================================================
  // LOGIN
  // =========================================================

  async function login(email, password) {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    localStorage.setItem("token", data.token);

    // Store complete user information
    setUser(data.user);

    return data;
  }

  // =========================================================
  // REGISTER
  // =========================================================

  async function register(
    name,
    email,
    password,
    studentDetails = {}
  ) {
    const data = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,

        // Student information
        studentId: studentDetails.studentId || "",
        phone: studentDetails.phone || "",
        dateOfBirth: studentDetails.dateOfBirth || "",
        gender: studentDetails.gender || "",
        address: studentDetails.address || "",

        // Academic information
        course: studentDetails.course || "",
        department: studentDetails.department || "",
        academicYear: studentDetails.academicYear || "",
        semester: studentDetails.semester || "",

        // Profile picture
        profilePicture: studentDetails.profilePicture || "",
      }),
    });

    localStorage.setItem("token", data.token);

    // Store complete registered user
    setUser(data.user);

    return data;
  }

  // =========================================================
  // UPDATE USER
  // =========================================================

  function updateUser(updatedUser) {
    setUser(updatedUser);
  }

  // =========================================================
  // LOGOUT
  // =========================================================

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  // =========================================================
  // CONTEXT
  // =========================================================

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        setUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =========================================================
// USE AUTH
// =========================================================

export function useAuth() {
  return useContext(AuthContext);
}