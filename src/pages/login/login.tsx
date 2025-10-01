import React, { useState } from "react";
import MoonToggle from "../../components/MoonToggle";
import logoUrl from "../../assets/Drivesence-logo.png"; 
import "./login.css";

type LoginForm = { identifier: string; password: string };
type Props = { onSuccess?: () => void }; 

export default function LoginPage({ onSuccess }: Props) {
  const [form, setForm] = useState<LoginForm>({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onChange =
    (key: keyof LoginForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value }));

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // --- placeholder: accept any credentials for now ---
    setTimeout(() => {
      setLoading(false);
      onSuccess?.(); // move to Driver Selection
    }, 350);
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
          />
        </label>

        <label className="pill input">
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={onChange("password")}
          />
        </label>

        <button className="pill cta" type="submit" disabled={loading}>
          {loading ? "…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}