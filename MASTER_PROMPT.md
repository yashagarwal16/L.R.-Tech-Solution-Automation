# Master Prompt: AI-Powered Consultancy & Digital Marketing Business Operating System

## Product vision

Build a modern, enterprise-grade, multi-tenant SaaS business operating system for consultancy, digital marketing, technology, creative, and service companies. It must unify CRM, leads, sales, clients, proposals, contracts, projects, milestones, tasks, teams, employees, performance, marketing, SEO, paid ads, social media, finance, invoices, payments, documents, calendar, communication, automation, AI agents, integrations, portals, analytics, audit logs, RBAC, and ABAC.

This is not a collection of disconnected dashboards. Use one connected lifecycle:

`Lead → Prospect → Client → Proposal → Contract → Project → Milestones → Tasks → Assignment → Work → Review → Approval → Delivery → Invoice → Payment → Reporting → Retention / Renewal`

Creating a contract should be able to create a project, milestones, tasks, assignments, deadlines, meetings, invoice schedule, notifications, client workspace, reporting requirements, and AI monitoring context.

## Architecture requirements

- Multi-tenant organizations with strict data isolation.
- API-first services and a normalized data model.
- Secure authentication, MFA, session management, OAuth, encryption, secrets management, token rotation, rate limiting, validation, safe webhooks, backups, and data retention.
- No secrets in frontend code and no Gmail/WhatsApp passwords.
- No fabricated integration metrics; show Connected, Syncing, Last synced, Error, Expired, Rate limited, or Disconnected states honestly.
- Full application, API, integration, AI, automation, performance, and audit observability.

## Users and authorization

Support Super Admin, Owner, CEO, COO, Operations Manager, Department Head, Team Lead, Project Manager, Sales, Marketing, SEO, Paid Ads, Social, Content, Design, Developer, Finance, HR, Customer Success, Employee, Intern, Consultant, Client Admin, and Client User personas, while allowing administrators to create custom roles.

Implement granular RBAC plus ABAC. Permissions cover resource/action pairs such as clients.read, clients.create, projects.assign, projects.approve, tasks.create, tasks.complete, finance.invoice.create, finance.payment.read, employees.performance.review, and marketing.campaign.update.

Authorization must consider organization, department, team, role, project, client, ownership, assignment, and sensitivity. Include an administrator **View As** feature for CEO, manager, marketing, sales, employee, finance, HR, and client perspectives.

## Role-based workspaces

- **CEO/Owner:** revenue, collections, outstanding payments, expenses, profit, clients, leads, conversion, active/at-risk projects, overdue work, team size, department performance, retention, recurring revenue, pipeline, renewals, and evidence-backed AI insights. Support company → department → team → employee → project → task drill-down.
- **Employee:** greeting, today/overdue/upcoming tasks, calendar, projects, deadlines, messages, notifications, documents, meetings, performance, workload, and AI assistant.
- **Sales:** leads, qualified leads, proposals, negotiations, won/lost, pipeline, expected revenue, follow-ups, meetings, conversion, sources, salesperson performance, and AI follow-ups.
- **Marketing:** campaigns, budgets, ad spend, CPL, CPA, ROAS, conversions, organic traffic, SEO rankings, social metrics, content pipeline, workload, reports, and alerts. Keep SEO, paid ads, social, content, email, and analytics unified.
- **Finance:** revenue, collections, receivables, expenses, profit, invoices, payments, refunds, taxes, recurring revenue, profitability, cash flow, reminders, and reports.
- **HR:** employees, departments, teams, attendance, leave, hiring, onboarding, documents, training, performance, lifecycle, and separately protected compensation data.
- **Client portal:** only that client's projects, progress, approved tasks, reports, documents, contracts, invoices, payments, meetings, messages, approvals, and support requests.

## CRM, projects, and people operations

Support leads, contacts, companies, opportunities, proposals, contracts, clients, projects, milestones, tasks, dependencies, time entries, files, communication, approvals, feedback, reports, and billing. Projects need List, Kanban, Calendar, Timeline, Gantt, and Table views. Task states include TODO, IN PROGRESS, REVIEW, APPROVED, COMPLETED, BLOCKED, ON HOLD, and CANCELLED.

Team dashboards show assignments, workload, capacity, blockers, dependencies, deadlines, and contribution. Performance is role-appropriate and evidence-based: quality, complexity, rework, approval, reliability, response time, contribution, and outcomes. AI may surface observations but must never make automatic employment decisions.

## AI / LLM layer

Use a provider abstraction for OpenAI, Gemini, Anthropic, and compatible providers:

`Provider → Model → AI Service → Tools → Permission Check → Business API → Database`

AI must not have unrestricted database access. Provide a universal permission-aware command bar for overdue payments, at-risk projects, today's work, client summaries, task creation, reply drafts, marketing performance, untouched leads, and executive summaries.

Specialized agents include Sales, Marketing, Project Manager, Finance, Client Success, and Executive agents. They may qualify leads, summarize conversations, suggest follow-ups, analyze campaigns, create project tasks, detect blockers, monitor invoices, identify client issues, prepare reports, and generate daily briefings. Every AI insight must show supporting authorized data.

## Approvals and automation

Sensitive operations follow: `AI proposes → Human reviews → Confirm → Execute → Audit log`. Configure approval requirements for client communications, bulk messages, financial transactions, contracts, deletion, permission changes, and other sensitive actions.

Build a visual `WHEN / IF / THEN` workflow engine with triggers from CRM, projects, tasks, calendar, finance, clients, employees, email, WhatsApp, webhooks, schedules, marketing metrics, and AI events. Support onboarding workflows, overdue-invoice reminders, at-risk-project escalation, retries, errors, run history, logs, and approvals.

## Integrations

Use secure OAuth/provider abstractions for Gmail, Google Calendar, Google Drive, WhatsApp Business, Twilio, Google Ads, Meta Ads, Google Analytics, Google Search Console, Slack/Microsoft Teams, Razorpay, and Stripe. Log authorized messages, meetings, ads, analytics, and search data against the correct lead, client, project, campaign, or task. Provide credential references, reconnect/disconnect controls, token rotation, verified webhooks, sync status, and integration logs.

## Documents, search, notifications, and reports

Manage contracts, proposals, invoices, reports, client files, brand guidelines, SOPs, and attachments. AI may extract client, value, dates, deliverables, payment schedules, milestones, and clauses from documents, but users confirm before records are created.

Provide permission-aware global search across clients, leads, projects, tasks, employees, documents, emails, messages, invoices, and reports. Add notification preferences for overdue work, invoices, assignments, meetings, deadlines, and AI insights. Add report builders for company, department, employee, client, project, marketing, finance, and sales with filters, PDF/CSV export, scheduled reports, and email delivery.

## Security and audit

Audit important actions with user, action, timestamp, resource, before/after values, source, and appropriate IP/device context. Make audit logs tamper-resistant. Include tenant isolation, input validation, output sanitization, CSRF protection where applicable, rate limiting, secure webhooks, backups, retention, and least privilege.

## UI and navigation

Create a premium, accessible, responsive SaaS interface with sidebar, global search, AI command bar, cards, tables, charts, Kanban, timeline, calendar, drawers, breadcrumbs, contextual actions, keyboard shortcuts, dark/light modes, and progressive disclosure. Avoid clutter, excessive colors, unnecessary animation, confusing navigation, and old-fashioned ERP styling.

Use reusable design-system components for typography, spacing, buttons, inputs, dropdowns, tables, cards, badges, charts, empty/loading/error states, toasts, modals, and panels. Standard states: Draft, Active, Pending, In Progress, Review, Approved, Completed, Blocked, Cancelled, Archived.

Suggested navigation: Dashboard; CRM (Leads, Contacts, Companies, Pipeline, Activities); Clients; Projects (All Projects, Milestones, Tasks, Gantt, Calendar); Team (Employees, Departments, Teams, Workload, Performance); Marketing (Campaigns, SEO, Ads, Social, Content, Analytics); Finance (Revenue, Invoices, Payments, Expenses, Reports); Communication (Gmail, WhatsApp, SMS, Internal Chat); Documents; Calendar; Automation; AI Agents; Reports; Integrations; Access & Permissions; Audit Logs; Settings.

Every screen must answer: **What can this user do next?** Dashboards personalize by role, department, team, permission, and responsibility. Mobile prioritizes tasks, notifications, messages, calendar, approvals, and client communication.

## Core entities

Organization, User, Role, Permission, Department, Team, Employee, Client, Contact, Lead, Opportunity, Proposal, Contract, Project, Milestone, Task, TaskDependency, TimeEntry, Campaign, MarketingMetric, Document, Invoice, Payment, Expense, Meeting, Message, Notification, Automation, AutomationRun, AIConversation, AITool, Integration, CredentialReference, and AuditLog.

All records require tenant scoping, constraints, indexes, relationships, ownership, and authorization checks.

## Delivery roadmap

Before coding, produce the PRD, feature map, information architecture, role matrix, permission matrix, ERD, API architecture, AI architecture, automation architecture, integration architecture, navigation, screen inventory, design system, user journeys, security architecture, tenant architecture, and roadmap.

Implement in phases:

1. Authentication, organizations, users, roles, permissions, dashboard, CRM, clients, projects, tasks, team, notifications.
2. Finance, invoices, payments, documents, calendar, reports, client portal.
3. Marketing, SEO, ads, campaigns, analytics.
4. Gmail, Calendar, Drive, WhatsApp, Twilio, and marketing APIs.
5. AI assistant, agents, tool calling, insights, and reports.
6. Visual automation, advanced analytics, enterprise security, observability, testing, hardening, and deployment.

## Non-negotiable rule

Do not build a fake static dashboard. Build real data models, relationships, authentication, authorization, CRUD, APIs, webhooks, automation, integrations, AI tool calling, audit logs, error handling, and secure credential management. If an integration is unavailable, expose a proper abstraction and mark it **Not Connected** instead of pretending it works.

Prioritize: **security → correct permissions → data integrity → excellent UX → automation → AI usefulness → scalability → maintainability**.
