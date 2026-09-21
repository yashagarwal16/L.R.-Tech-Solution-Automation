import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "../../../../lib/auth-session";

export async function GET(request: NextRequest) {
  const session = await verifySessionToken(request.cookies.get("lumen_session")?.value);
  return session ? NextResponse.json({ authenticated: true, role: session.role, email: session.email }) : NextResponse.json({ authenticated: false }, { status: 401 });
}
