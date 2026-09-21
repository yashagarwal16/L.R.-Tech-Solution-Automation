import Link from "next/link";
import { ArrowLeft, UserRound } from "lucide-react";
import { ProfileEditor } from "../../../components/ProfileEditor";
import "../dashboard.css";
import "../[section]/section.css";

export default function ProfilePage() {
  return <div className="section-shell"><header className="section-topbar"><Link href="/dashboard" className="section-back"><ArrowLeft size={16} /> Dashboard</Link><div className="section-top-actions"><span className="section-user"><UserRound size={14} /></span></div></header><main className="section-content"><div className="section-hero"><div className="section-icon violet"><UserRound size={24} /></div><div><span className="section-eyebrow">WORKSPACE / PROFILE</span><h1>My profile</h1><p>Customize the profile your teammates use to understand how to work with you.</p></div></div><ProfileEditor /></main></div>;
}
