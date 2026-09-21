import { NextRequest, NextResponse } from "next/server";
import { createSessionToken } from "../../../../lib/auth-session";
import { verifyPassword } from "../../../../lib/password";
import { workspaceStore } from "../../../../lib/workspace-store";
import { allowRequest, requestKey } from "../../../../lib/request-guard";

const accounts = [
  ["owner", "AUTH_OWNER_EMAIL", "AUTH_OWNER_PASSWORD"],
  ["manager", "AUTH_MANAGER_EMAIL", "AUTH_MANAGER_PASSWORD"],
  ["employee", "AUTH_EMPLOYEE_EMAIL", "AUTH_EMPLOYEE_PASSWORD"],
  ["finance", "AUTH_FINANCE_EMAIL", "AUTH_FINANCE_PASSWORD"],
  ["hr", "AUTH_HR_EMAIL", "AUTH_HR_PASSWORD"],
  ["client", "AUTH_CLIENT_EMAIL", "AUTH_CLIENT_PASSWORD"],
] as const;

export async function POST(request: NextRequest) {
  if (!allowRequest(requestKey(request, "sign-in"))) return NextResponse.json({ message: "Too many sign-in attempts. Try again in a few minutes." }, { status: 429, headers: { "Retry-After": "600" } });
  const body = await request.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const configured = (key: string) => Boolean(process.env[key] && !process.env[key]?.startsWith("replace_with_") && !process.env[key]?.includes("yourcompany"));
  if (!configured("AUTH_SESSION_SECRET")) return NextResponse.json({ message: "Sign-in is not configured yet. Add AUTH_SESSION_SECRET to .env.local, then restart the app." }, { status: 503 });
  const account = accounts.find(([role, emailKey, passwordKey]) => configured(emailKey) && configured(passwordKey) && process.env[emailKey]?.trim().toLowerCase() === email && process.env[passwordKey] === password);
  const profile = workspaceStore.users.find((user) => user.email === email && user.passwordHash);
  const profileMatches = profile?.passwordHash ? await verifyPassword(password, profile.passwordHash) : false;
  if (profileMatches && profile?.status !== "active") return NextResponse.json({ message: "Your workspace account is waiting for owner approval." }, { status: 403 });
  if (!account && !profileMatches) return NextResponse.json({ message: "The email or password is incorrect." }, { status: 401 });

  const role = account?.[0] ?? profile?.role ?? "employee";
  const response = NextResponse.json({ ok: true, role });
  response.cookies.set("lumen_session", await createSessionToken(role, email), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 8 });
  return response;
}
