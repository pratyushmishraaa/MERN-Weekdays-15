import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.email || !form.password) {
      setError("Both fields are required");
      return;
    }

    try {
      setLoading(true);

      await login(form.email, form.password);
      addToast("Signed in successfully", "success");
      navigate("/");
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Login failed";
      setError(message);
      addToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            to="/"
            className="text-3xl font-extrabold text-indigo-600"
          >
            Shop<span className="text-gray-800 dark:text-white">X</span>
          </Link>

          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Welcome back! Sign in to your account
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-8 flex flex-col gap-5">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Login
          </h2>

          {error && (
            <div className="bg-red-100 text-red-600 px-4 py-2 rounded">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <div>
              <label className="block mb-1 text-sm font-medium">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full border rounded-xl px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="********"
                className="w-full border rounded-xl px-3 py-2"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white py-2 rounded-xl"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-600 font-semibold"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;