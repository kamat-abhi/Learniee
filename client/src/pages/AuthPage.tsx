import { FormEvent, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound
} from "lucide-react";
import { ApiError, authApi } from "../api";
import type { User } from "../types";

interface Props {
  mode: "login" | "signup";
  onAuthenticated: (user: User) => void;
}

export default function AuthPage({ mode, onAuthenticated }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const signup = mode === "signup";

  if (location.pathname !== "/login" && location.pathname !== "/signup") {
    return <Navigate to={signup ? "/signup" : "/login"} replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (signup && name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = signup
        ? await authApi.signup({ name: name.trim(), email: email.trim(), password })
        : await authApi.login({ email: email.trim(), password });

      onAuthenticated(response.user);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to complete the request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-brand-panel">
        <div className="brand brand-light">
          <span className="brand-logo"><GraduationCap size={20} /></span>
          Learniee
        </div>

        <div className="brand-message">
          <span className="pill pill-light">Parent learning hub</span>
          <h1>Better courses. Better choices.</h1>
          <p>
            Search, compare and discover courses for your child from one simple
            parent dashboard.
          </p>

          <div className="trust-list">
            <div><CheckCircle2 size={18} /> Filter courses by what matters to you</div>
            <div><CheckCircle2 size={18} /> Compare teacher ratings and prices</div>
            <div><ShieldCheck size={18} /> Secure authenticated sessions</div>
          </div>
        </div>

        <div className="brand-footer">Built for the Learniee frontend assignment</div>
      </section>

      <section className="auth-form-panel">
        <div className="mobile-brand">
          <span className="brand-logo"><GraduationCap size={20} /></span>
          Learniee
        </div>

        <div className="auth-card">
          <span className="section-kicker">{signup ? "Get started" : "Welcome back"}</span>
          <h2>{signup ? "Create your account" : "Sign in to Learniee"}</h2>
          <p className="muted">
            {signup
              ? "Create a parent account to start exploring courses."
              : "Continue to your personalised course discovery dashboard."}
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {signup && (
              <Field label="Full name" icon={<UserRound size={18} />}>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Abhishek Kumar"
                  autoComplete="name"
                />
              </Field>
            )}

            <Field label="Email address" icon={<Mail size={18} />}>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </Field>

            <Field label="Password" icon={<LockKeyhole size={18} />}>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 6 characters"
                autoComplete={signup ? "new-password" : "current-password"}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </Field>

            {error && <div className="form-error">{error}</div>}

            <button className="primary-button submit-button" disabled={loading}>
              {loading ? <span className="spinner" /> : (
                <>
                  {signup ? "Create account" : "Sign in"}
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          <div className="auth-switch">
            {signup ? "Already have an account?" : "Don't have an account?"}
            {" "}
            <Link to={signup ? "/login" : "/signup"}>
              {signup ? "Sign in" : "Create one"}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  icon,
  children
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="form-field">
      <span>{label}</span>
      <div className="input-control">
        {icon}
        {children}
      </div>
    </label>
  );
}