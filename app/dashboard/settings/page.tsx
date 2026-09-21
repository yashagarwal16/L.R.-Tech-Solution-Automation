import Link from "next/link";
import { ArrowLeft, Settings2 } from "lucide-react";
import { SettingsPanel } from "../../../components/SettingsPanel";
import "../dashboard.css";
import "../[section]/section.css";

export default function SettingsPage() {
  return <div className="section-shell"><header className="section-topbar"><Link href="/dashboard" className="section-back"><ArrowLeft size={16} /> Dashboard</Link><div className="section-top-actions"><span className="section-user"><Settings2 size={14} /></span></div></header><main className="section-content"><div className="section-hero"><div className="section-icon violet"><Settings2 size={24} /></div><div><span className="section-eyebrow">CONTROL / SETTINGS</span><h1>Settings</h1><p>Manage your personal notification preferences and understand which security controls are active.</p></div></div><SettingsPanel /></main></div>;
}
