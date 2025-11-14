import React, { useState } from "react";
import MoonToggle from "../../components/MoonToggle";
import logoUrl from "../../assets/Drivesence-logo.png";
import "./login.css";
import { login } from "../../api/client"; 

type LoginForm = { identifier: string; password: string };
type Props = { onSuccess?: () => void };

export default function LoginPage({ onSuccess }: Props) {
  const [form, setForm] = useState<LoginForm>({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onChange =
    (key: keyof LoginForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // call backend API
      const { user } = await login(form.identifier.trim(), form.password);
      console.log("Logged in user:", user);

      onSuccess?.();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-head">
        <img src={logoUrl} alt="DriveSense" className="logo" />
        <MoonToggle />
      </div>

      <h1 className="login-title">Login To Your Account To Get Started</h1>

      <form className="login-form" onSubmit={onSubmit}>
        <label className="pill input">
          <input
            type="text"
            placeholder="Email or Username"
            value={form.identifier}
            onChange={onChange("identifier")}
            required
          />
        </label>

        <label className="pill input">
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={onChange("password")}
            required
          />
        </label>

        <button className="pill cta" type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </button>

        {error && <div className="login-error">{error}</div>}
      </form>
    </div>
  );
}
