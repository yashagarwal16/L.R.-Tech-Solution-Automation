"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { WorkspaceInbox } from "../../components/WorkspaceInbox";
import "./dashboard-extra.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(window.localStorage.getItem("lr-theme") === "dark");
  }, []);

  function toggleTheme() {
    const nextDark = !dark;
    setDark(nextDark);
    window.localStorage.setItem("lr-theme", nextDark ? "dark" : "light");
  }

  return <div className={`dashboard-app-root ${dark ? "dashboard-theme-dark" : ""}`}><button className="dashboard-theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${dark ? "light" : "dark"} mode`}>{dark ? <Sun size={14} /> : <Moon size={14} />}<span>{dark ? "Light mode" : "Dark mode"}</span></button>{children}<div className="dashboard-inbox-overlay"><WorkspaceInbox /></div></div>;
}
