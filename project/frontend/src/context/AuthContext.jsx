import { createContext, useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { clearCart } from "../store/cartSlice";
import api, { setAuthToken } from "../utils/api";

const AuthContext = createContext();

const readStoredValue = (key) => {
  if (typeof window === "undefined") return null;

  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const readStoredUser = () => {
  const storedUser = readStoredValue("user");
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(readStoredValue("token") || null);
  const [loading, setLoading] = useState(false);

  const updateUserInContext = (updatedUser) => {
    setUser((prevUser) => {
      const nextUser = { ...(prevUser || {}), ...updatedUser };
      localStorage.setItem("user", JSON.stringify(nextUser));
      return nextUser;
    });
  };

  const persistAuth = (userData, tokenValue) => {
    setUser(userData);
    setToken(tokenValue);

    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }

    if (tokenValue) {
      localStorage.setItem("token", tokenValue);
    } else {
      localStorage.removeItem("token");
    }

    setAuthToken(tokenValue);
  };

  const authFetch = async (url, options = {}) => {
    const tokenValue = readStoredValue("token");
    const headers = new Headers(options.headers || {});

    if (tokenValue) {
      headers.set("Authorization", `Bearer ${tokenValue}`);
    }

    return fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });
  };

  const register = async ({ username, email, password, role = "user", avatar }) => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);

    if (avatar) {
      formData.append("avatar", avatar);
    }

    const response = await fetch("/api/auth/v1/register", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return data;
  };

  const login = async (emailOrPayload, password) => {
    try {
      setLoading(true);

      const payload = typeof emailOrPayload === "string"
        ? { email: emailOrPayload, password }
        : emailOrPayload;

      const { data } = await api.post("/api/auth/v1/login", payload);

      persistAuth(data.user, data.token);

      return data.user;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    dispatch(clearCart());
    persistAuth(null, null);
  };

  const isLoggedIn = !!user;
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUserInContext,
        authFetch,
        isLoggedIn,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;