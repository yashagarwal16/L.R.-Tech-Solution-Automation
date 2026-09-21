"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, Check, LockKeyhole, Moon, Sparkles, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import "./sign-in.css";

const roles = ["Owner", "Manager", "Employee", "Finance", "HR", "Client"];

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(false);
  const [providerMessage, setProviderMessage] = useState("");
  useEffect(() => {
    setDark(window.localStorage.getItem("lr-theme") === "dark");
    if (new URLSearchParams(window.location.search).get("created") === "1") setProviderMessage("Your request was received. An owner must approve your workspace access before you can sign in.");
  }, []);
  function toggleTheme() {
    const nextDark = !dark;
    setDark(nextDark);
    window.localStorage.setItem("lr-theme", nextDark ? "dark" : "light");
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError("");
    try {
      const response = await fetch("/api/auth/sign-in", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      if (!response.ok) { const body = await response.json().catch(() => ({})); setError(body.message ?? "Unable to sign in."); setLoading(false); return; }
      const next = new URLSearchParams(window.location.search).get("next");
      router.push(next?.startsWith("/") ? next : "/dashboard");
    } catch { setError("We could not reach the sign-in service. Check your connection and try again."); setLoading(false); }
  }
  function provider(name: string) { setProviderMessage(`${name} sign-in is ready for provider credentials. Add the OAuth keys in your environment to enable it.`); }
  return <main className={`auth-shell ${dark ? "auth-theme-dark" : ""}`}><button className="auth-theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${dark ? "light" : "dark"} mode`}>{dark ? <Sun size={15} /> : <Moon size={15} />}<span>{dark ? "Light mode" : "Dark mode"}</span></button><div className="auth-art"><a href="/" className="auth-brand"><span className="auth-monogram">LR</span>L. R. <span>Tech Solutions</span></a><div className="auth-art-copy"><span className="auth-eyebrow">THE COMPANY OPERATIONS CONSOLE</span><h1>Work, with<br /><em>better signal.</em></h1><p>A calmer command center for the people moving your company forward.</p><div className="auth-proof"><Check size={15} /> Permission-aware by design</div><div className="auth-proof"><Check size={15} /> Every team sees what they need</div><div className="auth-proof"><Check size={15} /> One source of truth</div></div></div><section className="auth-card"><div className="auth-card-top"><span className="auth-mark"><LockKeyhole size={14} /></span><span>Secure workspace</span></div><div className="auth-heading"><span className="auth-eyebrow">WELCOME BACK</span><h2>Sign in to your<br />workspace.</h2><p>Continue with your company account.</p></div><div className="auth-providers"><button type="button" onClick={() => provider("Google")}><span className="provider-google">G</span> Continue with Google</button><button type="button" onClick={() => provider("Microsoft")}><span className="provider-microsoft">▦</span> Continue with Microsoft</button><button type="button" onClick={() => provider("GitHub")}><b>GH</b> Continue with GitHub</button></div><div className="auth-divider"><span>or use email</span></div><form onSubmit={submit}><label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" required /></label><label>Password<a href="#help">Forgot password?</a><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required /></label>{error && <div className="auth-error">{error}</div>}{providerMessage && <div className="auth-notice">{providerMessage}</div>}<button className="auth-submit" disabled={loading}>{loading ? "Checking..." : "Continue"}<ArrowRight size={17} /></button></form><p className="auth-switch">New to the workspace? <a href="/sign-up">Create an account</a></p><p className="auth-footer">Need access? <a href="/contact">Contact the workspace owner</a></p></section></main>;
}
