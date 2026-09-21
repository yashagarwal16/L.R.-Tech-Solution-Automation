export type WorkspaceRole = "owner" | "manager" | "employee" | "finance" | "hr" | "client";

const access: Record<WorkspaceRole, string[]> = {
  owner: ["*"],
  manager: ["crm", "clients", "projects", "calendar", "marketing", "finance", "documents", "communication", "automation", "ai-agents", "reports", "integrations", "team", "people-intelligence", "profile", "settings"],
  employee: ["projects", "calendar", "documents", "communication", "team", "profile", "settings"],
  finance: ["clients", "projects", "calendar", "finance", "documents", "reports", "profile", "settings"],
  hr: ["team", "calendar", "documents", "reports", "access", "audit-logs", "people-intelligence", "profile", "settings"],
  client: ["clients", "projects", "calendar", "documents", "communication", "profile", "settings"],
};

export function canAccessWorkspace(role: string, section: string) {
  const allowed = access[role as WorkspaceRole];
  return Boolean(allowed && (allowed.includes("*") || allowed.includes(section)));
}

export function canAssignProjects(role: string) {
  return role === "owner" || role === "manager";
}
