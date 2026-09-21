"use client";

import { FormEvent, useState } from "react";
import { Bot, Send, Sparkles, X } from "lucide-react";

type Props = { role: string; roleLabel: string; open: boolean; onClose: () => void };

const suggestions = ["What needs my attention?", "Summarise delivery risk", "What should I do next?"];

export function WorkspaceCopilot({ role, roleLabel, open, onClose }: Props) {
  const [messages, setMessages] = useState([{ from: "assistant", text: `L. R. Tech Solutions Copilot · I’m here for ${roleLabel}. I can explain signals, prioritise work, and point you to the right screen.` }]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);

  async function ask(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || loading) return;
    setDraft("");
    setMessages((items) => [...items, { from: "user", text }]);
    setLoading(true);
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: text, role }) });
      const data = await response.json();
      setMessages((items) => [...items, { from: "assistant", text: data.message || "L. R. Tech Solutions Copilot · I could not find a useful answer for that yet." }]);
    } catch {
      setMessages((items) => [...items, { from: "assistant", text: "L. R. Tech Solutions Copilot · The workspace assistant is temporarily unavailable. Try the relevant section instead." }]);
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;
  return <div className="copilot-backdrop" onMouseDown={onClose}><aside className="workspace-copilot" aria-label="Workspace copilot" onMouseDown={(event) => event.stopPropagation()}>
    <header><span className="copilot-icon"><Bot size={18} /></span><div><span className="panel-kicker">WORKSPACE COPILOT</span><h2>Ask the workspace</h2></div><button onClick={onClose} aria-label="Close copilot"><X size={17} /></button></header>
    <div className="copilot-messages">{messages.map((message, index) => <p className={`copilot-message ${message.from}`} key={`${message.from}-${index}`}>{message.text}</p>)}{loading && <p className="copilot-message assistant">Thinking…</p>}</div>
    <div className="copilot-suggestions">{suggestions.map((suggestion) => <button key={suggestion} onClick={() => setDraft(suggestion)}><Sparkles size={12} />{suggestion}</button>)}</div>
    <form onSubmit={ask}><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Ask about delivery, clients, or risk…" aria-label="Ask the workspace" /><button disabled={loading || !draft.trim()} aria-label="Send question"><Send size={15} /></button></form>
  </aside></div>;
}
