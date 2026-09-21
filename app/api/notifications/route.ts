import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "../../../lib/auth-session";
import { workspaceStore } from "../../../lib/workspace-store";

export async function GET(request: NextRequest) {
  const session = await verifySessionToken(request.cookies.get("lumen_session")?.value);
  if (!session) return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  const notifications = workspaceStore.notifications.filter((notification) => notification.recipient === "*" || notification.recipient === session.email);
  return NextResponse.json({ notifications });
}

export async function PATCH(request: NextRequest) {
  const session = await verifySessionToken(request.cookies.get("lumen_session")?.value);
  if (!session) return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const id = typeof body.id === "string" ? body.id : "";
  const notification = workspaceStore.notifications.find((item) => item.id === id && (item.recipient === "*" || item.recipient === session.email));
  if (notification) notification.read = true;
  return NextResponse.json({ ok: Boolean(notification) });
}
