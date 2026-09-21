import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PublicPage } from "../../components/PublicPage";

const insights = [["Operating rhythm", "How to make technology decisions without adding more meetings", "A practical way to connect priorities, systems, and the people doing the work."], ["Resilience", "Security is a business conversation", "The strongest security posture starts with understanding what the business cannot afford to lose."], ["Automation", "Where automation creates room to think", "Start with the repeated work that slows good people down, then build from evidence."]];
export const metadata: Metadata = { title: "IT, Cybersecurity & Automation Insights", description: "Practical perspectives on IT strategy, cybersecurity, systems, software, automation, and business technology." };
export default function InsightsPage() { return <PublicPage eyebrow="Insights / 03" title={<>Useful thinking for<br /><em>the next move.</em></>}><section className="page-content"><p>Notes from the work: practical perspectives on technology, security, systems, and the people who use them.</p><div className="page-grid" style={{ marginTop: 48 }}>{insights.map(([category, title, text]) => <article className="page-card" key={title}><span className="page-kicker">{category}</span><h2>{title}</h2><p>{text}</p><Link href="/contact">Talk about this <ArrowUpRight size={14} /></Link></article>)}</div></section></PublicPage>; }
