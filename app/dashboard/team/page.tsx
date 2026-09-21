import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import { TeamDirectory } from "../../../components/TeamDirectory";
import "../dashboard.css";
import "../[section]/section.css";

export default function TeamPage() {
  return <div className="section-shell"><header className="section-topbar"><Link href="/dashboard" className="section-back"><ArrowLeft size={16} /> Dashboard</Link><div className="section-top-actions"><span className="section-user"><Users size={14} /></span></div></header><main className="section-content"><div className="section-hero"><div className="section-icon lime"><Users size={24} /></div><div><span className="section-eyebrow">PEOPLE / DIRECTORY</span><h1>Team profiles</h1><p>Give every employee, manager, and client the right identity, role, and operating view.</p></div></div><TeamDirectory /></main></div>;
}
