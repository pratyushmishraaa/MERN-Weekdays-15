import { createContext, useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { clearCart } from "../store/cartSlice";
import api, { setAuthToken } from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );

  const [loading, setLoading] = useState(false);

  const updateUserInContext = (updatedUser) => {
    setUser((prevUser) => {
      const nextUser = { ...(prevUser || {}), ...updatedUser };
      localStorage.setItem("user", JSON.stringify(nextUser));
      return nextUser;
    });
  };

  const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem("token");
    const headers = new Headers(options.headers || {});

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });
  };

  const login = async (email, password) => {
    try {
      setLoading(true);

      const { data } = await api.post("/api/auth/v1/login", {
        email,
        password,
      });

      setUser(data.user);
      setToken(data.token);

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      setAuthToken(data.token);

      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    dispatch(clearCart());

    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setAuthToken(null);
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