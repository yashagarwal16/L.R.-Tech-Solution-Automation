"use client";

import { useEffect, useState } from "react";
import { Bell, Check, LockKeyhole, Save, ShieldCheck } from "lucide-react";

type Preferences = { inApp: boolean; email: boolean; weeklyBrief: boolean; compact: boolean };
const defaults: Preferences = { inApp: true, email: false, weeklyBrief: true, compact: false };

export function SettingsPanel() {
  const [preferences, setPreferences] = useState<Preferences>(defaults); const [saved, setSaved] = useState(false);
  useEffect(() => { try { const stored = localStorage.getItem("lrtech-preferences"); if (stored) setPreferences({ ...defaults, ...JSON.parse(stored) }); } catch { /* use defaults */ } }, []);
  function update(key: keyof Preferences) { setPreferences((current) => ({ ...current, [key]: !current[key] })); setSaved(false); }
  function save() { localStorage.setItem("lrtech-preferences", JSON.stringify(preferences)); setSaved(true); }
  return <div className="settings-panel"><div className="settings-intro"><div><span className="section-eyebrow">WORKSPACE / CONTROLS</span><h2>Settings that actually save.</h2><p>These preferences apply to this browser and signed-in workspace. Organization-wide permissions remain administrator-controlled.</p></div><button className="settings-save" onClick={save}><Save size={15} /> Save settings</button></div><div className="settings-grid"><section className="settings-card"><div className="settings-card-heading"><Bell size={17} /><div><b>Notifications</b><small>Choose which workspace signals you want to receive.</small></div></div>{([ ["inApp", "In-app notifications", "Show alerts in the dashboard bell."], ["email", "Email notifications", "Ready for a connected email provider."], ["weeklyBrief", "Weekly executive brief", "Keep the Monday internal summary enabled."], ["compact", "Compact work view", "Reduce spacing in dense operational views."] ] as const).map(([key, label, detail]) => <label className="settings-toggle" key={key}><span><b>{label}</b><small>{detail}</small></span><input type="checkbox" checked={preferences[key]} onChange={() => update(key)} /><i /></label>)}</section><section className="settings-card"><div className="settings-card-heading"><ShieldCheck size={17} /><div><b>Security status</b><small>Current application protection signals.</small></div></div><div className="settings-status"><Check size={14} /><span><b>Session cookie protected</b><small>HTTP-only signed session.</small></span></div><div className="settings-status"><Check size={14} /><span><b>Role checks active</b><small>Dashboard and API routes validate access.</small></span></div><div className="settings-status settings-warning"><LockKeyhole size={14} /><span><b>Production hardening needed</b><small>MFA, rate limiting, backups, and persistent users must be completed before launch.</small></span></div></section></div>{saved && <div className="settings-saved"><Check size={15} /> Settings saved for this browser.</div>}</div>;
}
