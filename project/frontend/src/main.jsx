import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";
import { AuthProvider } from "./context/AuthContext";
import { SearchProvider } from "./context/SearchContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Redux + persist for cart state */}
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* Theme must wrap everything so dark mode class is applied early */}
        <ThemeProvider>
          {/* Auth context — provides user, token, login, logout, register, authFetch */}
          <AuthProvider>
            {/* Search context — global search query shared between Navbar and Products */}
            <SearchProvider>
              <ToastProvider>
                <App />
              </ToastProvider>
            </SearchProvider>
          </AuthProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
