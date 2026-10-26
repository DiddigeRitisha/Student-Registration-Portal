const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
/**
 * Centralized helper for sending requests to the backend API.
 * Adds JSON headers and the saved authentication token.
 * Parses the response and throws an error when the API request fails.
 *
 * @param {string} path - API endpoint path.
 * @param {object} options - Fetch method, body, and request options.
 * @returns {Promise<object>} Parsed API response.
 */
export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const validationMessage = data.errors?.map((item) => item.message).join(", ");
    throw new Error(validationMessage || data.message || "Request failed");
  }

  return data;
}
