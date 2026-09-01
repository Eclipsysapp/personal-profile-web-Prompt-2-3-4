"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "../_components/AdminAuthProvider";
import { AdminApiError } from "@/lib/admin-api";
import { useAdminTheme } from "../_components/useAdminTheme";
import {
  EyeIcon,
  EyeOffIcon,
  MoonIcon,
  SecurityIcon,
  SunIcon,
  XIcon,
} from "../_components/icons";
import "../admin.css";

type FieldErrors = {
  email?: string;
  password?: string;
};

const highlights = [
  "Encrypted admin sessions",
  "Device-aware access control",
  "Full activity & audit trail",
];

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function AdminLoginClient() {
  const { theme, toggle, mounted } = useAdminTheme();
  const { admin, checking, signIn } = useAdminAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { if (!checking && admin) router.replace("/admin"); }, [admin, checking, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Front-end validation only. Real credential verification will be
    // handled by the existing Laravel admin auth endpoint later — this
    // form intentionally stores no tokens and performs no fake sign-in.
    const nextErrors: FieldErrors = {};
    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!isValidEmail(email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!password) {
      nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);
    setFormError("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    // Simulate the request lifecycle so the UI states are visible.
    // No authentication is performed and no credentials are persisted.
    setSubmitting(true);
    try {
      await signIn(email.trim().toLowerCase(), password);
      setPassword("");
      router.replace("/admin");
    } catch (error) {
      setFormError(error instanceof AdminApiError ? error.message : "Unable to sign in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="adx">
      <div className="adx-login">
        <aside className="adx-login-aside">
          <div className="adx-login-brand">
            <span className="adx-brand-mark" aria-hidden>
              AB
            </span>
            <span>
              <strong style={{ display: "block" }}>Anil Bhimani</strong>
              <span>Blog Administration</span>
            </span>
          </div>

          <div className="adx-login-pitch">
            <h2 className="text-balance">
              Your editorial control center, secured end to end.
            </h2>
            <p>
              Manage articles, moderate the community, and review visitor
              access from a single, privacy-first admin console.
            </p>
          </div>

          <div className="adx-login-points">
            {highlights.map((point) => (
              <div className="adx-login-point" key={point}>
                <span aria-hidden>
                  <SecurityIcon />
                </span>
                {point}
              </div>
            ))}
          </div>
        </aside>

        <main className="adx-login-main">
          <div className="adx-login-card">
            <div className="adx-login-topbar">
              <span className="adx-brand-mark" aria-hidden>
                AB
              </span>
              <span className="adx-login-brand">
                <span>
                  <strong style={{ display: "block", color: "var(--adx-ink)" }}>
                    Anil Bhimani
                  </strong>
                  <span>Blog Administration</span>
                </span>
              </span>
            </div>

            <div className="adx-login-head">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <p className="adx-login-eyebrow">Admin Access</p>
                <button
                  type="button"
                  className="adx-icon-btn"
                  onClick={toggle}
                  aria-label={
                    theme === "dark"
                      ? "Switch to light theme"
                      : "Switch to dark theme"
                  }
                >
                  {mounted && theme === "dark" ? <SunIcon /> : <MoonIcon />}
                </button>
              </div>
              <h1>Sign in to continue</h1>
              <p>Enter your administrator credentials to access the console.</p>
            </div>

            <form className="adx-form" onSubmit={handleSubmit} noValidate>
              {formError ? (
                <div className="adx-alert" role="alert">
                  <XIcon />
                  <span>{formError}</span>
                </div>
              ) : null}

              <div className="adx-field">
                <label htmlFor="admin-email">Email address</label>
                <div className="adx-input-wrap">
                  <input
                    id="admin-email"
                    type="email"
                    autoComplete="username"
                    placeholder="admin@anilbhimani.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={errors.email ? "is-invalid" : ""}
                    aria-invalid={Boolean(errors.email)}
                  />
                </div>
                {errors.email ? (
                  <p className="adx-field-error">{errors.email}</p>
                ) : null}
              </div>

              <div className="adx-field">
                <label htmlFor="admin-password">Password</label>
                <div className="adx-input-wrap">
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`has-toggle${errors.password ? " is-invalid" : ""}`}
                    aria-invalid={Boolean(errors.password)}
                  />
                  <button
                    type="button"
                    className="adx-pw-toggle"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {errors.password ? (
                  <p className="adx-field-error">{errors.password}</p>
                ) : null}
              </div>

              <button
                type="submit"
                className="adx-submit"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="adx-spinner" aria-hidden />
                    Signing in…
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <p className="adx-login-foot">
              Protected administrative area. Access attempts are logged and
              monitored.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
