import axios from "axios";

/**
 * Central axios instance.
 * - Targets the Vite dev-proxy (/api → http://localhost:3000)
 * - Sends cookies automatically
 * - All responses are parsed as JSON by axios
 */
const api = axios.create({
  baseURL: "/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Attach a Bearer token to every request.
 * Call this once after login / rehydration.
 */
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export default api;
