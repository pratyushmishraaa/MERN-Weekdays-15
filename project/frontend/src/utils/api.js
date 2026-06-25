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

const toText = (data) => {
  if (typeof data === "string") return data;
  if (data == null) return "";
  return JSON.stringify(data);
};

export const request = async (url, options = {}) => {
  const method = (options.method || "GET").toUpperCase();
  const headers = { ...(options.headers || {}) };
  const body = options.body;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  let data;

  if (body !== undefined) {
    if (isFormData) {
      data = body;
    } else if (body instanceof Blob || body instanceof ArrayBuffer || ArrayBuffer.isView(body)) {
      data = body;
    } else if (typeof body === "string" || typeof body === "number" || typeof body === "boolean") {
      data = body;
    } else {
      if (!headers["Content-Type"] && !headers["content-type"]) {
        headers["Content-Type"] = "application/json";
      }
      data = JSON.stringify(body);
    }
  }

  const config = {
    url,
    method,
    headers,
    data,
  };

  if (options.params) config.params = options.params;
  if (options.timeout) config.timeout = options.timeout;
  if (options.responseType) config.responseType = options.responseType;

  try {
    const response = await api.request(config);
    return {
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers,
      json: async () => response.data,
      text: async () => toText(response.data),
    };
  } catch (error) {
    const errResponse = error.response;
    const data = errResponse?.data;

    return {
      ok: false,
      status: errResponse?.status || 500,
      statusText: errResponse?.statusText || "Request failed",
      data,
      headers: errResponse?.headers || {},
      json: async () => data || {},
      text: async () => toText(data),
      error,
    };
  }
};

export default api;
