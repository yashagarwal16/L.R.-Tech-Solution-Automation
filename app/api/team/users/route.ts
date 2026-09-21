import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "../../../../lib/auth-session";
import { canAccessWorkspace } from "../../../../lib/access";
import { hashPassword } from "../../../../lib/password";
import { workspaceStore } from "../../../../lib/workspace-store";

function sessionFrom(request: NextRequest) { return verifySessionToken(request.cookies.get("lumen_session")?.value); }

export async function GET(request: NextRequest) {
  const session = await sessionFrom(request);
  if (!session || !canAccessWorkspace(session.role, "team")) return NextResponse.json({ message: "You do not have access to the team directory." }, { status: 403 });
  const users = session.role === "employee" ? workspaceStore.users.filter((user) => user.email === session.email || user.team === "Projects") : workspaceStore.users;
  return NextResponse.json({ users: users.map(({ passwordHash, ...user }) => user), role: session.role });
}

export async function POST(request: NextRequest) {
  const session = await sessionFrom(request);
  if (!session || !["owner", "manager", "hr"].includes(session.role)) return NextResponse.json({ message: "Only an owner, manager, or HR can add team members." }, { status: 403 });
  const body = await request.json().catch(() => ({}));
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const role = typeof body.role === "string" ? body.role : "employee";
  const password = typeof body.password === "string" ? body.password : "";
  const allowedRoles = session.role === "owner" ? ["owner", "manager", "employee", "finance", "hr", "client"] : ["employee", "client"];
  if (name.length < 2 || name.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !allowedRoles.includes(role)) return NextResponse.json({ message: session.role === "owner" ? "Enter a valid name, email, and role." : "You can only add employee or client accounts." }, { status: 400 });
  if (password && password.length < 12) return NextResponse.json({ message: "A login password must be at least 12 characters." }, { status: 400 });
  if (workspaceStore.users.some((user) => user.email.toLowerCase() === email)) return NextResponse.json({ message: "A profile with this email already exists." }, { status: 409 });
  const user = { id: `usr_${Date.now()}`, name, email, role: role as "owner" | "manager" | "employee" | "finance" | "hr" | "client", department: typeof body.department === "string" ? body.department.trim() : "General", team: typeof body.team === "string" ? body.team.trim() : "General", title: typeof body.title === "string" ? body.title.trim() : "Team member", status: password ? "active" as const : "invited" as const, ...(password ? { passwordHash: await hashPassword(password) } : {}) };
  workspaceStore.users.push(user);
  const { passwordHash, ...safeUser } = user;
  return NextResponse.json({ user: safeUser }, { status: 201 });
}
