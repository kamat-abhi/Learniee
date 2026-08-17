import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import type { User } from "./types";
import { authApi } from "./api";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    authApi.me()
      .then(({ user }) => setUser(user))
      .catch(() => setUser(null))
      .finally(() => setCheckingSession(false));
  }, []);

  if (checkingSession) {
    return (
      <div className="page-loader">
        <span className="spinner large" />
        <p>Checking your session...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={<AuthPage mode="login" onAuthenticated={setUser} />}
      />
      <Route
        path="/signup"
        element={<AuthPage mode="signup" onAuthenticated={setUser} />}
      />
      <Route
        path="/dashboard"
        element={
          user ? (
            <Dashboard
              user={user}
              onLogout={async () => {
                try {
                  await authApi.logout();
                } finally {
                  setUser(null);
                }
              }}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}