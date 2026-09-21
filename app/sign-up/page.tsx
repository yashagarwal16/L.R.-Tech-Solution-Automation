"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, Check, Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import "../sign-in/sign-in.css";

export default function SignUpPage() {
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [providerMessage, setProviderMessage] = useState("");
  useEffect(() => setDark(window.localStorage.getItem("lr-theme") === "dark"), []);
  function toggleTheme() {
    const next = !dark;
    setDark(next);
    window.localStorage.setItem("lr-theme", next ? "dark" : "light");
  }
  function provider(name: string) {
    setProviderMessage(`${name} sign-up is ready for provider credentials. Add the OAuth keys in your environment to enable it.`);
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch("/api/auth/sign-up", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) { setError(body.message ?? "Unable to create your account."); setLoading(false); return; }
    router.push("/sign-in?created=1");
  }
  return <main className={`auth-shell ${dark ? "auth-theme-dark" : ""}`}><button className="auth-theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${dark ? "light" : "dark"} mode`}>{dark ? <Sun size={15} /> : <Moon size={15} />}<span>{dark ? "Light mode" : "Dark mode"}</span></button><div className="auth-art"><a href="/" className="auth-brand"><span className="auth-monogram">LR</span>L. R. <span>Tech Solutions</span></a><div className="auth-art-copy"><span className="auth-eyebrow">A BETTER WAY TO WORK</span><h1>Bring your<br /><em>whole team.</em></h1><p>Create a secure workspace identity and keep every important decision in view.</p><div className="auth-proof"><Check size={15} /> Private by default</div><div className="auth-proof"><Check size={15} /> Built for focused teams</div><div className="auth-proof"><Check size={15} /> Ready when you are</div></div></div><section className="auth-card"><div className="auth-card-top"><span className="auth-mark">LR</span><span>Create workspace access</span></div><div className="auth-heading"><span className="auth-eyebrow">GET STARTED</span><h2>Create your<br />account.</h2><p>Join your company workspace in less than a minute.</p></div><div className="auth-providers"><button type="button" onClick={() => provider("Google")}><span className="provider-google">G</span> Sign up with Google</button><button type="button" onClick={() => provider("Microsoft")}><span className="provider-microsoft">▦</span> Sign up with Microsoft</button><button type="button" onClick={() => provider("GitHub")}><b>GH</b> Sign up with GitHub</button></div><div className="auth-divider"><span>or use email</span></div><form onSubmit={submit}><label>Full name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Your name" required /></label><label>Work email<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@company.com" required /></label><label>Create password<input type="password" minLength={8} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="At least 8 characters" required /></label>{error && <div className="auth-error">{error}</div>}{providerMessage && <div className="auth-notice">{providerMessage}</div>}<button className="auth-submit" disabled={loading}>{loading ? "Creating..." : "Create account"}<ArrowRight size={17} /></button></form><p className="auth-switch">Already have access? <a href="/sign-in">Sign in</a></p><p className="auth-footer">By continuing, you agree to our <a href="/terms">Terms</a> and <a href="/privacy">Privacy</a>.</p></section></main>;
}
