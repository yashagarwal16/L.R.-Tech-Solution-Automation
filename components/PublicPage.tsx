"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Mail, MapPin, Menu, Moon, Phone, Share2 as Linkedin, ShieldCheck, Sun, X } from "lucide-react";
import "./public-pages.css";

export const publicLinks = [
  ["Services", "/services"],
  ["About us", "/about"],
  ["Insights", "/insights"],
  ["Contact", "/contact"],
] as const;

export function PublicHeader({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return <header className={`page-header ${menuOpen ? "menu-open" : ""}`}><Link className="page-brand" href="/"><span className="brand-monogram">LR</span>L. R. <b>Tech Solutions</b></Link><nav>{publicLinks.map(([label, href]) => <Link key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</Link>)}</nav><div className="page-header-actions"><button className="page-theme-toggle" onClick={onToggle} aria-label={`Switch to ${dark ? "light" : "dark"} mode`}>{dark ? <Sun size={14} /> : <Moon size={14} />}<span>{dark ? "Light" : "Dark"}</span></button><Link className="page-signin" href="/sign-in">Team sign in</Link><Link className="page-cta" href="/contact">Start a conversation <ArrowRight size={14} /></Link><button className="page-menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close navigation" : "Open navigation"}>{menuOpen ? <X size={18} /> : <Menu size={18} />}</button></div></header>;
}

export function PublicFooter() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL && !process.env.NEXT_PUBLIC_CONTACT_EMAIL.startsWith("replace_with_") ? process.env.NEXT_PUBLIC_CONTACT_EMAIL : "";
  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE && !process.env.NEXT_PUBLIC_CONTACT_PHONE.startsWith("replace_with_") ? process.env.NEXT_PUBLIC_CONTACT_PHONE : "";
  return <footer className="page-footer"><div className="page-footer-main"><div><Link className="page-brand inverse" href="/"><span className="brand-monogram">LR</span>L. R. <b>Tech Solutions</b></Link><p>IT services and consulting<br />made from trust.</p></div><div className="page-footer-links"><span>Explore</span>{publicLinks.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</div><div className="page-footer-links"><span>Company workspace</span><Link href="/sign-in">Team sign in <ArrowUpRight size={13} /></Link><Link href="/sign-in?next=%2Fdashboard">Operations console <ArrowUpRight size={13} /></Link></div></div><div className="page-contact-strip"><div><MapPin size={16} /><span><b>Visit us</b><small>Alankar Plaza, Sector 2, Central Spine<br />Vidyadhar Nagar, Jaipur 302013</small></span></div>{email ? <div><Mail size={16} /><span><b>Email</b><a href={`mailto:${email}`}>{email}</a></span></div> : <div><Mail size={16} /><span><b>Email</b><Link href="/contact">Use the contact form</Link></span></div>}{phone ? <div><Phone size={16} /><span><b>Call</b><a href={`tel:${phone}`}>{phone}</a></span></div> : <div><Phone size={16} /><span><b>Call</b><Link href="/contact">Request a callback</Link></span></div>}<div><Linkedin size={16} /><span><b>Follow</b><a href="https://www.linkedin.com/company/lr-tech-solutions/" target="_blank" rel="noreferrer">LinkedIn</a></span></div></div><div className="page-footer-bottom"><span>© 2026 L. R. Tech Solutions</span><span><ShieldCheck size={13} /> Trust, by design</span><div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div></div></footer>;
}

export function PublicPage({ eyebrow, title, children }: { eyebrow: string; title: React.ReactNode; children: React.ReactNode }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(window.localStorage.getItem("lr-theme") === "dark");
  }, []);

  function toggleTheme() {
    const nextDark = !dark;
    setDark(nextDark);
    window.localStorage.setItem("lr-theme", nextDark ? "dark" : "light");
  }

  return <div className={`public-page ${dark ? "theme-dark" : "theme-light"}`}><PublicHeader dark={dark} onToggle={toggleTheme} /><main><section className="page-hero"><span className="page-kicker">{eyebrow}</span><h1>{title}</h1></section>{children}</main><PublicFooter /></div>;
}
