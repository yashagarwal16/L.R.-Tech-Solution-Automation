"use client";
import { FormEvent, useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "saved" | "error">("idle");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus("sending");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form.entries())) });
      const data = await response.json().catch(() => ({}));
      setStatus(response.ok ? (data.emailSent ? "sent" : "saved") : "error");
      if (response.ok) formElement.reset();
    } catch {
      setStatus("error");
    }
  }
  return <form className="contact-form" onSubmit={submit}><label>Name<input name="name" required placeholder="Your name" /></label><label>Work email<input name="email" type="email" required placeholder="you@company.com" /></label><label>Company<input name="company" placeholder="Company name" /></label><label>What do you need?<select name="need" defaultValue=""><option value="" disabled>Select an area</option><option>IT consulting</option><option>Cloud & infrastructure</option><option>Cybersecurity</option><option>Software & automation</option></select></label><label className="wide">Message<textarea name="message" required placeholder="What are you trying to improve, protect, or build?" /></label>{status === "error" && <p className="form-error">We could not save your message. Please try again.</p>}{status === "sent" && <p className="form-success"><Check size={15} /> Your message was saved and emailed to the team.</p>}{status === "saved" && <p className="form-error">Your message was saved, but the team email could not be delivered yet.</p>}<button type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : status === "sent" || status === "saved" ? "Message saved" : "Start a conversation"} {status === "sent" ? <Check size={15} /> : <ArrowRight size={15} />}</button></form>;
}
