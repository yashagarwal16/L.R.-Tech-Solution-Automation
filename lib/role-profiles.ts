import type { WorkspaceRole } from "./access";

export const roleProfiles: Record<WorkspaceRole, { label: string; focus: string; sections: string[]; widgets: string[] }> = {
  owner: { label: "Owner", focus: "Company command center", sections: ["*"], widgets: ["Business pulse", "Revenue", "Delivery risk", "People signals", "System health"] },
  manager: { label: "Operations manager", focus: "Team and delivery coordination", sections: ["crm", "clients", "projects", "calendar", "marketing", "finance", "documents", "communication", "automation", "ai-agents", "reports", "integrations", "team", "people-intelligence"], widgets: ["Delivery queue", "Team workload", "Project health", "Client moments"] },
  employee: { label: "Team member", focus: "Assigned work and deadlines", sections: ["projects", "calendar", "documents", "communication", "team"], widgets: ["My tasks", "Deadlines", "Messages", "Assigned projects"] },
  finance: { label: "Finance", focus: "Cash and receivables", sections: ["clients", "projects", "calendar", "finance", "documents", "reports"], widgets: ["Collected", "Outstanding", "Invoices", "Cash flow"] },
  hr: { label: "People & culture", focus: "People operations and evidence", sections: ["team", "calendar", "documents", "reports", "access", "audit-logs", "people-intelligence"], widgets: ["Team directory", "Leave", "Review signals", "Open roles"] },
  client: { label: "Client workspace", focus: "Your projects and decisions", sections: ["clients", "projects", "calendar", "documents", "communication"], widgets: ["Project progress", "Approvals", "Documents", "Messages"] },
};

export function getRoleProfile(role: string) {
  return roleProfiles[role as WorkspaceRole] ?? roleProfiles.employee;
}
