import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "../../../../lib/password";
import { workspaceStore } from "../../../../lib/workspace-store";
import { allowRequest, requestKey } from "../../../../lib/request-guard";

export async function POST(request: NextRequest) {
  if (!allowRequest(requestKey(request, "sign-up"), 5)) return NextResponse.json({ message: "Too many signup attempts. Try again in a few minutes." }, { status: 429, headers: { "Retry-After": "600" } });
  const body = await request.json().catch(() => ({}));
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (name.length < 2 || !email.includes("@") || password.length < 8) return NextResponse.json({ message: "Enter your name, a valid email, and a password of at least 8 characters." }, { status: 400 });
  if (workspaceStore.users.some((user) => user.email.toLowerCase() === email)) return NextResponse.json({ message: "An account with this email already exists." }, { status: 409 });
  workspaceStore.users.push({ id: `usr_${Date.now()}`, name, email, role: "employee", department: "Unassigned", team: "New workspace member", title: "Team member", status: "invited", passwordHash: await hashPassword(password) });
  return NextResponse.json({ ok: true }, { status: 201 });
}
