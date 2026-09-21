import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "../../../lib/auth-session";
import { workspaceStore } from "../../../lib/workspace-store";

export async function GET(request: NextRequest) {
  const session = await verifySessionToken(request.cookies.get("lumen_session")?.value);
  if (!session) return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  return NextResponse.json({ messages: workspaceStore.messages.filter((message) => message.recipient === "*" || message.recipient === session.email) });
}

export async function POST(request: NextRequest) {
  const session = await verifySessionToken(request.cookies.get("lumen_session")?.value);
  if (!session) return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const recipient = typeof body.recipient === "string" ? body.recipient.trim().toLowerCase() : "";
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const preview = typeof body.preview === "string" ? body.preview.trim() : "";
  const recipientUser = workspaceStore.users.find((user) => user.email.toLowerCase() === recipient && user.status === "active");
  if (!recipientUser || recipient === session.email || subject.length < 2 || subject.length > 120 || preview.length < 2 || preview.length > 2000) {
    return NextResponse.json({ message: "Choose an active teammate and enter a subject and message." }, { status: 400 });
  }
  const sender = workspaceStore.users.find((user) => user.email.toLowerCase() === session.email.toLowerCase())?.name ?? session.email;
  const message = { id: `msg_${Date.now()}`, recipient, sender, subject, preview, unread: true, createdAt: "Just now" };
  workspaceStore.messages.unshift(message);
  workspaceStore.notifications.unshift({ id: `ntf_${Date.now()}`, recipient, title: `New message from ${sender}`, body: subject, kind: "message", read: false, createdAt: "Just now" });
  return NextResponse.json({ message }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const session = await verifySessionToken(request.cookies.get("lumen_session")?.value);
  if (!session) return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const id = typeof body.id === "string" ? body.id : "";
  const message = workspaceStore.messages.find((item) => item.id === id && item.recipient === session.email);
  if (message) message.unread = false;
  return NextResponse.json({ ok: Boolean(message) });
}
