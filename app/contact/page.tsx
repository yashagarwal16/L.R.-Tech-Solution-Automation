import type { Metadata } from "next";
import { ArrowRight, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { ContactForm } from "../../components/ContactForm";
import { PublicPage } from "../../components/PublicPage";

export const metadata: Metadata = { title: "Contact IT Consulting & Technology Experts", description: "Talk with L. R. Tech Solutions about IT strategy, cloud, cybersecurity, software, automation, or your next technology decision." };

export default function ContactPage() { return <PublicPage eyebrow="Contact / 04" title={<>Let’s make the<br /><em>next move clear.</em></>}><section className="page-content contact-layout"><div><p>Tell us what you are trying to improve, protect, or build. Your message is sent to the L. R. Tech Solutions intake workspace for review by the team.</p><div className="contact-details"><div><Mail size={18} /><span><b>Business enquiries</b><small>Stored securely in the company intake workspace</small></span></div><div><ShieldCheck size={18} /><span><b>Private by design</b><small>We only use your details to respond to this enquiry</small></span></div></div><Link href="/" className="text-back">Back to the homepage <ArrowRight size={14} /></Link></div><ContactForm /></section></PublicPage>; }
