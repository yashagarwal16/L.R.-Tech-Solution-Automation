import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ProjectAssignment from "@/models/ProjectAssignment";
import { canAssignProjects } from "@/lib/access";
import { verifySessionToken } from "@/lib/auth-session";
import { recordAutomationRun } from "@/lib/automation";

function value(input: unknown, max: number) { return typeof input === "string" ? input.trim().slice(0, max) : ""; }

export async function POST(request: NextRequest) {
  const session = await verifySessionToken(request.cookies.get("lumen_session")?.value);
  if (!session || !canAssignProjects(session.role)) return NextResponse.json({ success: false, message: "Only owners and managers can assign projects." }, { status: 403 });
  try {
    const body = await request.json();
    const projectId = value(body.projectId, 120); const projectName = value(body.projectName, 160); const assigneeId = value(body.assigneeId, 120); const assigneeName = value(body.assigneeName, 120);
    if (!projectId || !projectName || !assigneeId || !assigneeName) return NextResponse.json({ success: false, message: "Project and assignee are required." }, { status: 400 });
    await dbConnect();
    const assignment = await ProjectAssignment.findOneAndUpdate({ projectId }, { projectId, projectName, assigneeId, assigneeName, assignedByRole: session.role, assignedByEmail: session.email }, { upsert: true, new: true, setDefaultsOnInsert: true });
    await recordAutomationRun({ workflowId: "project-handoff", trigger: "project.assigned", resourceType: "project", resourceId: projectId, details: { projectName, assigneeName, assignedBy: session.email, nextAction: "delivery-checklist" } });
    return NextResponse.json({ success: true, assignmentId: assignment._id.toString(), assigneeName }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, message: "Assignment could not be saved. Check the database connection." }, { status: 503 });
  }
}
