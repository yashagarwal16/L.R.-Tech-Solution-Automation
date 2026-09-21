"use client";

import { useState } from "react";
import { Check, UserPlus } from "lucide-react";

export function AssignProjectButton({ projectId, projectName, assigneeId = "ravi-nair", assigneeName = "Ravi Nair" }: { projectId: string; projectName: string; assigneeId?: string; assigneeName?: string }) {
  const [state, setState] = useState<"idle" | "saving" | "assigned" | "error">("idle");
  async function assign() {
    setState("saving");
    const response = await fetch("/api/projects/assign", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ projectId, projectName, assigneeId, assigneeName }) });
    setState(response.ok ? "assigned" : "error");
  }
  return <button className={`assign-project ${state}`} onClick={assign} disabled={state === "saving" || state === "assigned"}>{state === "assigned" ? <><Check size={13} /> Assigned to {assigneeName}</> : state === "saving" ? "Assigning…" : state === "error" ? "Retry assignment" : <><UserPlus size={13} /> Assign to {assigneeName}</>}</button>;
}
