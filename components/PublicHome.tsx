"use client";

import { FormEvent, type CSSProperties, useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  Cloud,
  Code2,
  Menu,
  Moon,
  Network,
  ShieldCheck,
  Sparkles,
  Sun,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import "./public-home.css";
import { PublicFooter } from "./PublicPage";

const expertise = [
  ["Cloud & infrastructure", "A dependable foundation for the way your business works.", Cloud],
  ["Cybersecurity & resilience", "Make risk visible, reduce exposure, and keep operations moving.", ShieldCheck],
  ["Software & automation", "Turn repetitive work into systems that give your team more room.", Code2],
  ["Technology consulting", "Clear decisions, practical roadmaps, and a partner who stays close.", BarChart3],
] as const;

const principles = [
  ["Trust first", "Clear advice, responsible delivery, and relationships built to last."],
  ["Human by design", "Technology should serve the people and the business using it."],
  ["Built for momentum", "Practical systems that make the next stage of growth easier."],
];

type Theme = "light" | "dark";

export default function PublicHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "saved" | "error">("idle");
  const [welcomeOpen, setWelcomeOpen] = useState(true);
  const [welcomeProgress, setWelcomeProgress] = useState(0);
  const [welcomeIndex, setWelcomeIndex] = useState(0);
  const [welcomePointer, setWelcomePointer] = useState({ x: 50, y: 50 });
  const welcomeThemes = ["Clarity", "Resilience", "Momentum"];

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("lr-theme");
    if (savedTheme === "dark" || savedTheme === "light") setTheme(savedTheme);
  }, []);

  useEffect(() => {
    if (!welcomeOpen) return;
    const started = Date.now();
    const progressTimer = window.setInterval(() => setWelcomeProgress(Math.min(100, ((Date.now() - started) / 3600) * 100)), 40);
    const themeTimer = window.setInterval(() => setWelcomeIndex((index) => (index + 1) % welcomeThemes.length), 1200);
    return () => { window.clearInterval(progressTimer); window.clearInterval(themeTimer); };
  }, [welcomeOpen]);

  function changeTheme(nextTheme: Theme) {
    setTheme(nextTheme);
    window.localStorage.setItem("lr-theme", nextTheme);
  }

  function enterSite() {
    setWelcomeOpen(false);
  }

  function replayWelcome() {
    setWelcomeProgress(0);
    setWelcomeIndex(0);
    setWelcomeOpen(true);
  }

  function moveWelcome(event: React.PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    setWelcomePointer({ x: ((event.clientX - rect.left) / rect.width) * 100, y: ((event.clientY - rect.top) / rect.height) * 100 });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form.entries())),
      });
      const data = await response.json().catch(() => ({}));
      setStatus(response.ok ? (data.emailSent ? "sent" : "saved") : "error");
      if (response.ok) formElement.reset();
    } catch {
      setStatus("error");
    }
  }

  const isDark = theme === "dark";

  return (
    <div className={`public-shell ${isDark ? "theme-dark" : "theme-light"}`}>
      {welcomeOpen && <div className="welcome-gate" onPointerMove={moveWelcome} style={{ "--welcome-x": `${welcomePointer.x}%`, "--welcome-y": `${welcomePointer.y}%` } as CSSProperties} role="dialog" aria-modal="true" aria-labelledby="welcome-title"><div className="welcome-grid" /><div className="welcome-node node-one" /><div className="welcome-node node-two" /><div className="welcome-node node-three" /><div className="welcome-horizontal"><div className="welcome-horizontal-top"><div className="welcome-gate-mark">LR</div><span className="public-kicker"><span /> L. R. Tech Solutions</span><button className="welcome-skip" onClick={enterSite}>Skip intro</button></div><div className="welcome-horizontal-main"><div className="welcome-copy"><span className="welcome-overline">BUILT FOR THE NEXT DECISION</span><h2 id="welcome-title">Technology that<br /><em>moves with you.</em></h2><p>We design the systems, software, and digital experiences that make ambitious businesses easier to run.</p><div className="welcome-gate-actions"><button className="public-button dark" onClick={enterSite}>Enter the studio <ArrowRight size={17} /></button></div></div><div className="welcome-signal"><span>WHAT WE BUILD</span><strong>{welcomeThemes[welcomeIndex]}</strong><div className="welcome-signal-line"><i /><i /><i /></div><div className="welcome-capabilities"><b>IT strategy</b><b>Cloud systems</b><b>Custom software</b><b>Cybersecurity</b><b>Automation</b></div></div></div><div className="welcome-horizontal-bottom"><div className="welcome-gate-meta"><span>01</span><i /><span className="welcome-changing-word">{welcomeThemes[welcomeIndex]}</span><span>·</span><span>Human-led</span></div><div className="welcome-progress"><span style={{ width: `${welcomeProgress}%` }} /></div><small>Move your cursor · discover the signal</small></div></div></div>}
      <div className="public-noise" />
      <div className="public-spotlight" />
      <div className="public-orb orb-one" />
      <div className="public-orb orb-two" />

      <header className="public-header">
        <Link className="public-brand" href="/">
          <span className="brand-monogram">LR</span>
          L. R. <b>Tech Solutions</b>
        </Link>
        <nav className={menuOpen ? "public-nav open" : "public-nav"}>
          <Link href="/services">Services</Link>
          <Link href="/about">About us</Link>
          <Link href="/insights">Insights</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/sign-in">Team sign in</Link>
          <Link className="public-nav-cta" href="/contact">Start a conversation <ArrowRight size={14} /></Link>
        </nav>
        <div className="public-header-actions">
          <button className="theme-switch" onClick={() => changeTheme(isDark ? "light" : "dark")} aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}>
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
            <span>{isDark ? "Light" : "Dark"}</span>
          </button>
          <Link className="public-dashboard-link" href="/sign-in">Operations console <ArrowUpRight size={14} /></Link>
          <button className="welcome-replay" onClick={replayWelcome} aria-label="Replay first visit experience">Replay intro</button>
          <Link className="public-header-cta" href="/contact">Start a conversation <ArrowRight size={14} /></Link>
        </div>
        <button className="public-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <main id="top">
        <section className="public-hero">
          <div className="public-hero-copy">
            <div className="public-kicker"><span /> IT services &amp; consulting · Jaipur</div>
            <p className="hero-index">/ 01 — The signal</p>
            <h1>Make room<br /><em>for better</em><br />thinking.</h1>
            <p className="public-hero-lede">L. R. Tech Solutions makes technology simpler, safer, and more useful — with advice that stays close to the people and the work.</p>
            <div className="public-hero-actions">
              <Link className="public-button dark" href="/contact">Talk to our team <ArrowRight size={17} /></Link>
              <Link className="public-text-link" href="/about"><span><Zap size={13} fill="currentColor" /></span> See how we work</Link>
            </div>
            <div className="public-hero-proof">
              <div className="public-avatars"><i>LR</i><i>IT</i><i>TR</i><i>+</i></div>
              <div><div className="public-stars">MADE FROM TRUST <b>· 2018</b></div><small>IT services and consulting from Jaipur</small></div>
            </div>
          </div>

          <div className="public-form-wrap" id="contact">
            <div className="public-orbit orbit-a" />
            <div className="public-orbit orbit-b" />
            <div className="public-form-card">
              <div className="public-form-head">
                <div><span className="public-form-label">START HERE / 01</span><h2>Bring us the<br /><em>hard problem.</em></h2></div>
                <span className="public-form-badge"><ShieldCheck size={15} /> Confidential</span>
              </div>
              <p className="public-form-intro">Tell us what is slowing the business down. Your enquiry goes to our intake workspace for review.</p>
              <form onSubmit={submit}>
                <div className="public-field-row"><label>Your name<input name="name" required placeholder="Your name" /></label><label>Work email<input name="email" required type="email" placeholder="you@company.com" /></label></div>
                <div className="public-field-row"><label>Company<input name="company" placeholder="Company name" /></label><label>What do you need?<select name="need" defaultValue=""><option value="" disabled>Select an area</option><option>IT consulting</option><option>Cloud &amp; infrastructure</option><option>Cybersecurity</option><option>Software &amp; automation</option></select></label></div>
                <label>Tell us a little more<textarea name="message" required placeholder="What are you trying to improve, protect, or build?" /></label>
                {status === "error" && <small className="public-form-error">We could not save your message. Please try again.</small>}
                {status === "sent" && <small className="public-form-success"><Check size={14} /> Sent to the L. R. Tech Solutions intake workspace.</small>}
                {status === "saved" && <small className="public-form-error">Your message was saved, but the team email could not be delivered yet.</small>}
                <button className="public-submit" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : status === "sent" || status === "saved" ? <>Message saved <Check size={17} /></> : <>Start a conversation <ArrowRight size={17} /></>}</button>
                <small className="public-form-note">A thoughtful response from a real person. No noise.</small>
              </form>
            </div>
            <div className="public-float-note note-a"><span><Check size={13} /></span><b>Human expertise</b><small>Advice that fits your business</small></div>
            <div className="public-float-note note-b"><span><Network size={13} /></span><b>Built to connect</b><small>Systems that work together</small></div>
          </div>
        </section>

        <section className="public-marquee"><div className="public-marquee-label">Technology should feel</div><div className="public-marquee-track"><span>TRUSTED</span><span>◦</span><span>PRACTICAL</span><span>◦</span><span>SECURE</span><span>◦</span><span>HUMAN</span><span>◦</span><span>RESPONSIVE</span><span>◦</span><span>BUILT TO LAST</span></div></section>

        <section className="public-section public-services" id="services">
          <div className="public-section-head"><div><span className="public-section-kicker">What we solve / 02</span><h2>Good systems<br /><em>change the weather.</em></h2></div><p>Technology is only useful when it makes the business clearer, safer, or faster. We help you find the work that matters most.</p></div>
          <div className="public-service-grid">{expertise.map(([title, text, Icon], index) => <article key={title} className={`public-service-card card-${index}`}><div className="public-service-top"><span>0{index + 1}</span><ArrowDownRight size={18} /></div><span className="public-service-icon"><Icon size={21} /></span><h3>{title}</h3><p>{text}</p><Link href="/contact">Explore capability <ArrowRight size={15} /></Link></article>)}</div>
        </section>

        <section className="public-proof-section" id="about">
          <div className="public-proof-intro"><span className="public-section-kicker">About L. R. Tech Solutions / 03</span><h2>Clarity is a<br /><em>competitive edge.</em></h2><p>Founded in 2018 and based in Jaipur, L. R. Tech Solutions is an IT Services and IT Consulting company for teams that value clarity, accountability, and work that lasts.</p><Link className="public-outline-button" href="/about">Meet our approach <ArrowRight size={15} /></Link></div>
          <div className="public-proof-grid"><div><strong>2018</strong><small>Founded in Jaipur</small></div><div><strong>11<span>–50</span></strong><small>People in the company</small></div><div><strong>01</strong><small>Close, accountable partner</small></div><div><strong>∞</strong><small>Room to build what is next</small></div></div>
        </section>

        <section className="public-section subjects-section" id="approach">
          <div className="public-section-head"><div><span className="public-section-kicker">How we work / 04</span><h2>Simple in theory.<br /><em>Serious in practice.</em></h2></div><p>Our best work starts with context. We understand the business, make the trade-offs clear, then build a plan your team can actually use.</p></div>
          <div className="public-subject-grid">{principles.map(([title, text], index) => <Link className={`public-subject-card ${["lime", "blue", "violet"][index]}`} href="/about" key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div><ArrowUpRight size={18} /></Link>)}</div>
        </section>

        <section className="public-section public-insights" id="insights">
          <div className="public-section-head"><div><span className="public-section-kicker">From the field / 05</span><h2>Useful ideas<br /><em>for the road ahead.</em></h2></div><p>Practical notes on security, systems, and making technology work harder without making your team work harder.</p></div>
          <div className="public-insight-grid">
            <Link className="public-insight-card" href="/insights"><span>01 / SECURITY</span><h3>The calmest system is the one you can see.</h3><ArrowUpRight size={18} /></Link>
            <Link className="public-insight-card" href="/insights"><span>02 / OPERATIONS</span><h3>Small improvements compound into momentum.</h3><ArrowUpRight size={18} /></Link>
            <Link className="public-insight-card" href="/insights"><span>03 / GROWTH</span><h3>Clarity is a better starting point than speed.</h3><ArrowUpRight size={18} /></Link>
          </div>
        </section>

        <section className="public-closing-cta">
          <div><span className="public-section-kicker">Ready when you are / 06</span><h2>Bring us the<br /><em>hard problem.</em></h2></div>
          <Link className="public-button dark" href="#contact">Start a conversation <ArrowRight size={17} /></Link>
        </section>
        <section className="public-home-contact" id="contact-home">
          <div>
            <span className="public-section-kicker">Contact / 07</span>
            <h2>Make the next<br /><em>move clear.</em></h2>
            <p>Tell us what you are trying to improve, protect, or build. We will connect you with a real person from the L. R. Tech Solutions team.</p>
          </div>
          <div className="public-home-contact-actions">
            <Link className="public-button dark" href="/contact">Open the contact form <ArrowRight size={17} /></Link>
            <Link className="public-outline-button" href="/insights">Read our insights <ArrowUpRight size={15} /></Link>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
