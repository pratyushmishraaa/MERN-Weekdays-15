import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="text-7xl font-black text-indigo-500">404</div>
        <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-gray-100">Page not found</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          The page you are looking for may have moved or no longer exists.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/" className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700">
            Go home
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
