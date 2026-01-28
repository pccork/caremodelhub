// Login page uses AutContext JWT

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setErr(null);
    setBusy(true);
    try {
      await login(email, password);
      nav("/dashboard");
    } catch (e: any) {
      setErr(e?.response?.data?.error || e?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="section" style={{ maxWidth: 520, margin: "0 auto" }}>
      <h1 className="title">CareModel Hub — Login</h1>
      {err && <div className="notification is-danger">{err}</div>}

      <div className="field">
        <label className="label">Email</label>
        <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div className="field">
        <label className="label">Password</label>
        <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>

      <button className={`button is-primary is-fullwidth ${busy ? "is-loading" : ""}`} onClick={submit}>
        Log in
      </button>
    </div>
  );
}
