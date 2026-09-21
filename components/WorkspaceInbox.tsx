"use client";

import { FormEvent, useEffect, useState } from "react";
import { Bell, Check, MessageCircle, Send, X } from "lucide-react";

type Notification = { id: string; title: string; body: string; kind: string; read: boolean; createdAt: string };
type Message = { id: string; sender: string; subject: string; preview: string; unread: boolean; createdAt: string };
type Teammate = { email: string; name: string };

export function WorkspaceInbox() {
  const [open, setOpen] = useState<"notifications" | "messages" | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [teammates, setTeammates] = useState<Teammate[]>([]);
  const [composeOpen, setComposeOpen] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [preview, setPreview] = useState("");
  const [sendState, setSendState] = useState("");

  useEffect(() => {
    fetch("/api/notifications").then((response) => response.ok ? response.json() : null).then((data) => data && setNotifications(data.notifications)).catch(() => undefined);
    fetch("/api/messages").then((response) => response.ok ? response.json() : null).then((data) => data && setMessages(data.messages)).catch(() => undefined);
    fetch("/api/team/users").then((response) => response.ok ? response.json() : null).then((data) => data && setTeammates(data.users.map((user: Teammate) => ({ email: user.email, name: user.name })))).catch(() => undefined);
  }, []);

  const unread = notifications.filter((item) => !item.read).length;
  const unreadMessages = messages.some((item) => item.unread);
  async function readNotification(id: string) {
    await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setNotifications((items) => items.map((item) => item.id === id ? { ...item, read: true } : item));
  }
  async function readMessage(id: string) {
    await fetch("/api/messages", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setMessages((items) => items.map((item) => item.id === id ? { ...item, unread: false } : item));
  }
  async function sendMessage(event: FormEvent) {
    event.preventDefault();
    setSendState("");
    const response = await fetch("/api/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ recipient, subject, preview }) });
    const data = await response.json();
    if (!response.ok) { setSendState(data.message ?? "Message could not be sent."); return; }
    if (data.message) setMessages((items) => [data.message, ...items]);
    setSubject(""); setPreview(""); setRecipient(""); setComposeOpen(false); setSendState("Message sent.");
  }
  function toggle(kind: "notifications" | "messages") {
    setOpen(open === kind ? null : kind);
    if (kind === "messages") setSendState("");
  }

  return <>
    <button className="icon-button inbox-trigger" onClick={() => toggle("notifications")} aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}><Bell size={18} />{unread > 0 && <i>{unread}</i>}</button>
    <button className="icon-button inbox-trigger" onClick={() => toggle("messages")} aria-label={`Messages${unreadMessages ? ", unread" : ""}`}><MessageCircle size={18} />{unreadMessages && <i />}</button>
    {open && <aside className="inbox-drawer" aria-label={open === "notifications" ? "Notifications" : "Messages"}>
      <div className="inbox-heading"><div><span>{open === "notifications" ? "WORKSPACE SIGNALS" : "INTERNAL COMMUNICATION"}</span><h2>{open === "notifications" ? "Notifications" : "Messages"}</h2></div><button onClick={() => setOpen(null)} aria-label="Close"><X size={16} /></button></div>
      {open === "notifications" ? <div className="inbox-list">{notifications.map((item) => <article className={item.read ? "read" : ""} key={item.id}><div><b>{item.title}</b><p>{item.body}</p><small>{item.createdAt}</small></div>{!item.read && <button onClick={() => readNotification(item.id)} aria-label="Mark as read"><Check size={14} /></button>}</article>)}{!notifications.length && <p className="inbox-empty">You are all caught up.</p>}</div> : <>
        <button className="compose-message-button" onClick={() => setComposeOpen(!composeOpen)}><Send size={14} /> New message</button>
        {composeOpen && <form className="message-composer" onSubmit={sendMessage}><select value={recipient} onChange={(event) => setRecipient(event.target.value)} required aria-label="Recipient"><option value="">Choose teammate</option>{teammates.map((user) => <option value={user.email} key={user.email}>{user.name}</option>)}</select><input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Subject" required maxLength={120} /><textarea value={preview} onChange={(event) => setPreview(event.target.value)} placeholder="Write your message…" required maxLength={2000} rows={4} /><button type="submit">Send message</button></form>}
        <div className="inbox-list">{messages.map((item) => <article className={item.unread ? "" : "read"} key={item.id} onClick={() => item.unread && readMessage(item.id)}><div><b>{item.subject}</b><p><strong>{item.sender}</strong> · {item.preview}</p><small>{item.createdAt}</small></div>{item.unread && <button onClick={() => readMessage(item.id)} aria-label="Mark as read"><Check size={14} /></button>}</article>)}{!messages.length && <p className="inbox-empty">No messages yet.</p>}</div>
      </>}{sendState && <p className="inbox-status">{sendState}</p>}</aside>}
  </>;
}
