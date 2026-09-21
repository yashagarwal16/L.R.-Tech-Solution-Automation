import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "./lib/auth-session";
import { canAccessWorkspace } from "./lib/access";

export async function proxy(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/dashboard")) return NextResponse.next();
  const session = await verifySessionToken(request.cookies.get("lumen_session")?.value);
  if (!session) {
    const signIn = new URL("/sign-in", request.url);
    signIn.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(signIn);
  }
  const section = request.nextUrl.pathname.split("/")[2];
  if (section && !canAccessWorkspace(session.role, section)) {
    const dashboard = new URL("/dashboard", request.url);
    dashboard.searchParams.set("error", "forbidden");
    return NextResponse.redirect(dashboard);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*"] };
