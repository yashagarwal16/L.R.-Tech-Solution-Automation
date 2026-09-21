import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "./lib/auth-session";

export async function POST(request: NextRequest) {
  const session = await verifySessionToken(request.cookies.get("lumen_session")?.value);
  if (!session) return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  const body = await request.json().catch(() => null);
  const message = typeof body?.message === "string" ? body.message.trim().toLowerCase() : "";
  const role = session.role;
  if (!message || message.length > 500) return NextResponse.json({ message: "Ask a short question about delivery, clients, finance, people, or systems." }, { status: 400 });
  const roleHint = role === "finance" ? "your receivables and invoice queue" : role === "hr" ? "people evidence and review signals" : role === "client" ? "your active delivery and upcoming decisions" : "the decision queue and delivery map";
  let answer = `Start with ${roleHint}. The highest-value next step is to open the item marked “needs attention”, confirm its owner, and record the decision in the relevant workspace section.`;
  if (message.includes("risk") || message.includes("attention")) answer = "The main delivery risk is Atlas Health: the sprint is due tomorrow with four open tasks. Open Projects, review the milestone owner, and resolve or reassign the blockers before the client review.";
  else if (message.includes("next") || message.includes("priorit")) answer = `For ${role === "owner" ? "an owner" : roleHint}, handle the oldest exception first, then check the related client or project record. Avoid starting a new initiative until the exception has an owner and a due date.`;
  else if (message.includes("summary") || message.includes("summar")) answer = "The workspace shows steady business pulse, one delivery watch, healthy client status, and three connected systems. Google Ads is the clearest low-effort improvement because it unlocks complete marketing reporting.";
  return NextResponse.json({ message: `L. R. Tech Solutions Copilot · ${answer}` });
}
