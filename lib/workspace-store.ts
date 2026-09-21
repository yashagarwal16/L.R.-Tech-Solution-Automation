import type { WorkspaceRole } from "./access";

export type WorkspaceUser = { id: string; name: string; email: string; role: WorkspaceRole; department: string; team: string; title: string; status: "active" | "invited" | "inactive"; passwordHash?: string; avatar?: string; bio?: string; links?: { website?: string; linkedin?: string; github?: string; instagram?: string } };
export type WorkspaceNotification = { id: string; recipient: string; title: string; body: string; kind: "task" | "message" | "system"; read: boolean; createdAt: string };
export type WorkspaceMessage = { id: string; recipient: string; sender: string; subject: string; preview: string; unread: boolean; createdAt: string };

const seedUsers: WorkspaceUser[] = [
  ["Aarav Mehta", "owner@lrtech.local", "owner", "Leadership", "Executive", "Owner"],
  ["Maya Singh", "manager@lrtech.local", "manager", "Operations", "Delivery", "Operations Manager"],
  ["Jamie Kim", "employee@lrtech.local", "employee", "Marketing", "SEO", "SEO Specialist"],
  ["Ravi Nair", "ravi@lrtech.local", "employee", "Delivery", "Projects", "Project Manager"],
  ["Samira Patel", "samira@lrtech.local", "employee", "Client Success", "Accounts", "Client Success Manager"],
  ["Noah Williams", "noah@lrtech.local", "employee", "Creative", "Design", "Product Designer"],
  ["Anika Shah", "anika@lrtech.local", "employee", "Engineering", "Web", "Frontend Developer"],
  ["Priya Kapoor", "finance@lrtech.local", "finance", "Finance", "Finance", "Finance Manager"],
  ["Liam Carter", "hr@lrtech.local", "hr", "People", "People & Culture", "HR Manager"],
  ["Northstar Admin", "client@lrtech.local", "client", "Client", "Northstar Labs", "Client Admin"],
].map(([name, email, role, department, team, title], index) => ({ id: `usr_${index + 1}`, name, email, role: role as WorkspaceRole, department, team, title, status: "active" }));

const configuredAccounts: Array<[WorkspaceRole, string | undefined, string]> = [
  ["owner", process.env.AUTH_OWNER_EMAIL, "Owner"],
  ["manager", process.env.AUTH_MANAGER_EMAIL, "Operations Manager"],
  ["employee", process.env.AUTH_EMPLOYEE_EMAIL, "Team Member"],
  ["finance", process.env.AUTH_FINANCE_EMAIL, "Finance Manager"],
  ["hr", process.env.AUTH_HR_EMAIL, "HR Manager"],
  ["client", process.env.AUTH_CLIENT_EMAIL, "Client Admin"],
];

for (const [role, email, title] of configuredAccounts) {
  if (!email || seedUsers.some((user) => user.email.toLowerCase() === email.toLowerCase())) continue;
  const name = email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  seedUsers.push({ id: `env_${role}`, name, email: email.toLowerCase(), role, department: "General", team: "Workspace", title, status: "active" });
}

const seedNotifications: WorkspaceNotification[] = [
  { id: "ntf_1", recipient: "*", title: "Atlas Health needs a decision", body: "The sprint is due tomorrow with four open tasks.", kind: "task", read: false, createdAt: "Today · 09:42" },
  { id: "ntf_2", recipient: "*", title: "New client conversation", body: "Northstar Labs added a note to the website project.", kind: "message", read: false, createdAt: "Today · 09:18" },
  { id: "ntf_3", recipient: "*", title: "Google Ads is disconnected", body: "Marketing reporting is incomplete until a source is connected.", kind: "system", read: true, createdAt: "Yesterday" },
];

const seedMessages: WorkspaceMessage[] = [
  { id: "msg_1", recipient: "*", sender: "Samira Patel", subject: "Northstar homepage direction", preview: "Can you review the latest client note before the 11:00 meeting?", unread: true, createdAt: "12 min ago" },
  { id: "msg_2", recipient: "*", sender: "Ravi Nair", subject: "Atlas SEO sprint", preview: "I have marked the four blocked tasks for manager review.", unread: true, createdAt: "48 min ago" },
];

declare global { var workspaceStore: { users: WorkspaceUser[]; notifications: WorkspaceNotification[]; messages: WorkspaceMessage[] } | undefined; }
export const workspaceStore = global.workspaceStore ?? (global.workspaceStore = { users: seedUsers, notifications: seedNotifications, messages: seedMessages });
