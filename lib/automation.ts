import AutomationRun from "@/models/AutomationRun";

export const growthAutomations = [
  { id: "lead-intake-routing", name: "Lead intake routing", trigger: "New contact enquiry", action: "Save enquiry, classify service need, and queue owner follow-up", approval: "No external message without approval" },
  { id: "project-handoff", name: "Project handoff", trigger: "Project assigned", action: "Record owner, create handoff run, and prepare the delivery checklist", approval: "Manager or owner required" },
  { id: "delivery-risk-watch", name: "Delivery risk watch", trigger: "Deadline approaching", action: "Compare progress and open blockers, then create an attention item", approval: "Internal alert only" },
  { id: "invoice-follow-up", name: "Invoice follow-up", trigger: "Invoice overdue", action: "Prepare a reminder and finance task", approval: "Human approval before sending" },
  { id: "client-review-reminder", name: "Client review reminder", trigger: "Review date approaching", action: "Prepare meeting brief and client-success task", approval: "Human approval before external message" },
  { id: "weekly-executive-brief", name: "Weekly executive brief", trigger: "Every Monday", action: "Summarize delivery, pipeline, cash, and risks from authorized data", approval: "Internal report" },
] as const;

export async function recordAutomationRun(input: { workflowId: string; trigger: string; resourceType: string; resourceId: string; details?: Record<string, string> }) {
  try {
    return await AutomationRun.create({ ...input, status: "completed", details: input.details ?? {} });
  } catch {
    return null;
  }
}
