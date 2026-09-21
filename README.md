# L. R. Tech Solutions — Company Operations Console

## Who this README is for :

This document is the handover guide for:

- **The company owner:** configure production accounts, MongoDB, Gmail notifications, and Render.
- **The deployment operator:** connect the repository, set hosting environment variables, deploy, and run the smoke tests.
- **The developer:** understand the application structure, routes, security model, integrations, and remaining production work.
- **The future maintainer:** identify which features are live, which are MVP/demo-backed, and which integrations are intentionally deferred.

It is not a document for storing passwords, API keys, database URLs, or other secrets. Put production values only in Render's Environment page and keep local values in `.env.local`.

## 1. What this project is

This project is a modern public company website plus a protected company operations workspace for L. R. Tech Solutions.

It is designed as a foundation for a service-company operating system. It connects the public lead journey with internal work such as client management, delivery, project assignment, team profiles, role-aware dashboards, notifications, messages, finance visibility, marketing visibility, documents, automations, and future AI/integration services.

It is intentionally more than a landing page and more than a collection of static dashboard cards. The application is organized around the operating lifecycle:

```text
Visitor
  -> Contact enquiry
  -> Lead intake
  -> Client / opportunity
  -> Project
  -> Assignment
  -> Delivery and review
  -> Invoice and payment
  -> Reporting
  -> Retention / renewal
```

The current repository is a working product foundation and polished MVP. It is not yet the complete production ERP/CRM/AI platform described in `MASTER_PROMPT.md`. Some integrations and persistent business modules still need to be completed before selling it as a fully production-grade enterprise platform.

## 2. Technology stack

| Area | Technology |
| --- | --- |
| Application | Next.js 16.3.5 App Router |
| Language | TypeScript |
| UI | React 19, custom CSS design system, Lucide icons |
| Motion | CSS transitions and reduced-motion support |
| Backend | Next.js Route Handlers |
| Database | MongoDB through Mongoose |
| Authentication | Signed HTTP-only session cookie using Web Crypto HMAC |
| Password hashing | PBKDF2 with Web Crypto for profiles created in the current workspace store |
| Deployment target | Vercel + MongoDB Atlas, or Render / DigitalOcean for worker-heavy workloads |
| Source control | GitHub recommended |

## 3. Start the project

### Install

```bash
npm.cmd install
```

### Configure local environment

Copy `.env.example` to `.env.local`:

```powershell
Copy-Item .env.example .env.local
```

Replace all placeholder values. Never commit `.env.local`.

### Run development mode

```bash
npm.cmd run dev
```

Open:

- Public website: `http://localhost:3000`
- Sign-in: `http://localhost:3000/sign-in`
- Dashboard: `http://localhost:3000/dashboard`
- Team directory: `http://localhost:3000/dashboard/team`
- Personal profile: `http://localhost:3000/dashboard/profile`

### Production build

```bash
npm.cmd run build
npm.cmd start
```

The build must complete successfully before deployment.

## 4. Environment variables

The complete placeholder list is in `.env.example`.

### Database

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string. Use MongoDB Atlas in production. |

### Authentication

| Variable | Purpose |
| --- | --- |
| `AUTH_SESSION_SECRET` | Long random secret used to sign session cookies. |
| `AUTH_OWNER_EMAIL` / `AUTH_OWNER_PASSWORD` | Development owner account. |
| `AUTH_MANAGER_EMAIL` / `AUTH_MANAGER_PASSWORD` | Development manager account. |
| `AUTH_EMPLOYEE_EMAIL` / `AUTH_EMPLOYEE_PASSWORD` | Development employee account. |
| `AUTH_FINANCE_EMAIL` / `AUTH_FINANCE_PASSWORD` | Development finance account. |
| `AUTH_HR_EMAIL` / `AUTH_HR_PASSWORD` | Development HR account. |
| `AUTH_CLIENT_EMAIL` / `AUTH_CLIENT_PASSWORD` | Development client account. |

These environment accounts are compatibility accounts for the current MVP. Change all local passwords before handing the project to a client. Do not put real passwords in the README, frontend code, screenshots, logs, or API responses.

### Public contact configuration

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public URL used by the application. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Public company contact email. |
| `NEXT_PUBLIC_CONTACT_PHONE` | Public company phone number. |
| `NEXT_PUBLIC_WHATSAPP` | Public WhatsApp number, when verified. |

### Contact enquiry email notifications

Contact enquiries are saved to MongoDB first and then sent to the configured
internal recipients through Gmail SMTP. Configure these server-only variables:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=notifications@gmail.com
SMTP_APP_PASSWORD=replace_with_google_app_password
OWNER_NOTIFICATION_EMAIL=owner@gmail.com
MANAGER_NOTIFICATION_EMAIL=manager@gmail.com
ADDITIONAL_NOTIFICATION_EMAILS=finance@gmail.com,hr@gmail.com,assistant@gmail.com
```

`SMTP_USER` is the Gmail account that sends the notification. `SMTP_APP_PASSWORD`
is a Google App Password for that account, not the normal Gmail password. The
three recipient variables control who receives each contact enquiry. The
additional list accepts comma-separated addresses.

To get these values:

1. Choose the Gmail account that will send notifications.
2. Turn on 2-Step Verification for that Google account.
3. Open the account's **Security** page and choose **App passwords**.
4. Create an app password named `Website notifications`.
5. Copy the generated 16-character value into `SMTP_APP_PASSWORD`. Google may
   display spaces; remove the spaces when saving it.
6. Put the owner, manager, and other Gmail addresses in the recipient variables.
   These are destinations, not API credentials.

The SMTP password and sender configuration must never use the `NEXT_PUBLIC_` prefix.
If email delivery fails, the enquiry remains saved and the server logs the
delivery failure for investigation.

### Optional Twilio WhatsApp configuration

The environment files now include placeholders for future Twilio WhatsApp
notifications:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=replace_with_twilio_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
TWILIO_WHATSAPP_TO=whatsapp:+919876543210
```

These variables are currently configuration-only; the application does not send
WhatsApp messages until the Twilio sender and notification route are implemented.
Get the Account SID and Auth Token from the Twilio Console. Use the Sandbox
sender while testing, and use an approved production WhatsApp sender and
templates before sending business-initiated messages.

Only values intended for the browser should use the `NEXT_PUBLIC_` prefix. Never use that prefix for secrets.

Future AI, OAuth, marketing, messaging, and payment integrations are not included
in the active environment template because they are not wired into the current
application. Add their credentials only when the related integration is
implemented and approved.

## 5. Public website

### Public routes

| Route | Purpose |
| --- | --- |
| `/` | Company homepage and primary conversion journey |
| `/services` | Service capabilities |
| `/about` | Company positioning and identity |
| `/insights` | Public insight/content area |
| `/contact` | Lead/contact form |
| `/privacy` | Privacy policy page |
| `/terms` | Terms page |
| `/sign-in` | Private workspace authentication |

### Public website behavior

- Uses the L. R. Tech Solutions identity and logo asset in `public/company-logo.jpg`.
- Uses a premium editorial technology-company visual system rather than the old academic-template design.
- Includes responsive layouts for desktop, tablet, and mobile.
- Uses a real contact form instead of a purely visual form.
- Footer contact information is driven by environment variables where the company has not supplied verified details.
- Public pages should be indexed; authenticated dashboard pages should not be treated as public SEO pages.

## 6. Contact enquiry flow

The public contact form submits to `POST /api/contact`.

```text
Visitor submits form
  -> Validate name, email, company, need, message
  -> Connect to MongoDB
  -> Save ContactInquiry
  -> Record lead-intake-routing automation run
  -> Send branded Gmail notification to configured recipients
  -> Return success and email delivery status to the visitor
```

The enquiry is saved in the **L. R. Tech Solutions intake workspace** and a branded email is sent through Gmail SMTP to the configured owner, manager, and additional recipients. The sender name is **L. R. TECH Website**, and the visitor's address is used as the reply-to address. If email delivery fails, the enquiry remains saved and the API returns `emailSent: false`.

WhatsApp is not active yet. The Twilio variables are placeholders for a future integration and do not send messages by themselves.

### Contact data stored

`models/ContactInquiry.ts` stores:

- name
- email
- company
- requested need/service
- message
- status: `new`, `reviewed`, or `archived`
- creation and update timestamps

## 7. Authentication and sessions

### Sign-in flow

1. User opens `/sign-in`.
2. User submits email and password.
3. `POST /api/auth/sign-in` validates the credentials.
4. The server creates a signed session payload containing role, email, and expiry.
5. The server sets an HTTP-only `lumen_session` cookie.
6. The user is redirected to `/dashboard` or the requested protected route.

### Session protection

- Session signing uses `AUTH_SESSION_SECRET`.
- The cookie is HTTP-only.
- SameSite is `lax`.
- Secure cookies are enabled in production.
- Sessions expire after the configured session lifetime.
- `/api/auth/session` returns the current authorized role and email.
- `/api/auth/sign-out` clears the session.

### Important current limitation

The environment account flow is the reliable current sign-in path. New profile passwords are PBKDF2 hashed in the workspace development store. Before production, move all user credentials to the persistent `UserProfile` database model, add invitation tokens, password reset, MFA, account lockout, rate limiting, and session revocation.

## 8. Organization members and profiles

### Adding a team member

An owner, manager, or HR user can open:

```text
Dashboard -> Team -> Add team member
```

The form accepts:

- full name
- company email
- role
- department
- team
- professional title
- optional initial password

If a password is entered, the profile is marked `active`. If no password is entered, it is marked `invited`.

### Personal profile customization

Every signed-in member can open **Edit my profile** or `/dashboard/profile` and update:

- display name
- professional title
- department
- team
- bio
- profile photo
- website
- LinkedIn
- GitHub
- Instagram

The member cannot change:

- role
- email
- permissions
- organization
- approval authority

Profile photos are limited to image formats and a 1 MB client-side limit. Profile links accept HTTPS URLs only.

### Profile API

- `GET /api/team/profile` — returns the signed-in member's safe profile.
- `PATCH /api/team/profile` — updates the signed-in member's editable fields.
- `GET /api/team/users` — returns role-appropriate team profiles.
- `POST /api/team/users` — creates a profile for owner, manager, or HR.

Passwords are never returned by these routes.

## 9. Roles and access

The current roles are:

| Role | Dashboard focus | Main visible areas |
| --- | --- | --- |
| Owner | Company command center | All areas |
| Manager | Team and delivery coordination | CRM, clients, projects, calendar, marketing, finance, documents, communication, automation, AI, reports, integrations, team, people intelligence |
| Employee | Assigned work and deadlines | Projects, calendar, documents, communication, team, profile, settings |
| Finance | Cash and receivables | Clients, projects, calendar, finance, documents, reports, profile, settings |
| HR | People operations and evidence | Team, calendar, documents, reports, access, audit logs, people intelligence, profile, settings |
| Client | Projects and decisions | Clients, projects, calendar, documents, communication, profile, settings |

### Enforcement

Authorization is applied in two places:

1. `proxy.ts` blocks unauthenticated dashboard access and section routes.
2. API route handlers verify the signed session and check the role before reading or mutating data.

Frontend hiding is only a usability feature. It is not the security boundary.

### Role configuration files

- `lib/access.ts` — section access and project assignment permission.
- `lib/role-profiles.ts` — role labels, focus, allowed sections, and dashboard widget intent.

### Current authorization limitation

The current implementation is primarily RBAC. Production ABAC should add organization, ownership, department, team, assignment, client, data sensitivity, and resource-level filters to every read and write operation.

## 10. Dashboard and navigation

### Main dashboard

`/dashboard` is the Company Operations Console. It currently includes:

- business pulse
- delivery health
- client health
- system health
- decision queue
- change ledger
- delivery map
- role focus
- one-click project assignment for owners and managers
- responsive mobile navigation
- notification bell
- message drawer
- personal profile shortcut

### Dashboard sections

- Operations Console
- CRM
- Clients
- Projects
- Calendar
- Marketing
- Finance
- Documents
- Communication
- Automation
- AI Agents
- Reports
- Integrations
- People Intelligence
- Access
- Audit Logs
- Team
- Settings
- My Profile

The section pages currently provide structured MVP views and seeded operating context. They are ready to be connected to live business queries.

## 11. Notifications and messages

### Notifications

The dashboard notification bell uses:

- `GET /api/notifications` — fetches authorized notifications.
- `PATCH /api/notifications` — marks a notification as read.

The UI shows unread count, title, description, timestamp, and read state.

### Messages

The message icon uses:

- `GET /api/messages` — fetches authorized internal message previews.

The current message surface is a communication foundation. It is not yet a full real-time chat system. Production chat needs persistent conversation/thread/message models, message creation, read receipts, attachments, search, moderation, WebSockets or polling, and provider integrations.

## 12. Project assignment

Owners and managers can assign a project from the delivery map in one click.

```text
Manager clicks Assign
  -> Selects responsible person
  -> POST /api/projects/assign
  -> Verify signed session and manager/owner role
  -> Validate project and assignee
  -> Upsert ProjectAssignment
  -> Record project-handoff automation run
```

`models/ProjectAssignment.ts` stores project, assignee, assigning role, assigning email, and timestamps.

## 13. Automation system

The automation catalog is defined in `lib/automation.ts`.

| Automation | Trigger | Current behavior | Approval |
| --- | --- | --- | --- |
| Lead intake routing | New contact enquiry | Save enquiry, classify need, queue owner follow-up | Required before external message |
| Project handoff | Project assigned | Record owner and prepare delivery checklist | Owner or manager |
| Delivery risk watch | Deadline approaching | Compare progress and blockers, create attention item | Internal alert |
| Invoice follow-up | Invoice overdue | Prepare reminder and finance task | Human approval before sending |
| Client review reminder | Review date approaching | Prepare meeting brief and client-success task | Human approval before external message |
| Weekly executive brief | Every Monday | Summarize delivery, pipeline, cash, and risks | Internal report |

Automation runs are recorded through `models/AutomationRun.ts` when MongoDB is available.

### What is automated now

- Contact enquiry validation and storage.
- Lead-intake automation record.
- Project assignment storage.
- Project-handoff automation record.
- Role-aware dashboard queues.
- Role-aware navigation.
- Notification unread/read interaction.
- Profile validation and update flow.

### What is not automated yet

- Actual email delivery.
- Actual WhatsApp sending.
- Payment collection.
- Contract-to-project generation.
- Calendar event creation.
- Automatic employee promotion, warning, or termination decisions.
- Real-time AI monitoring.
- Google, Meta, Gmail, Twilio, Slack, Teams, Stripe, and Razorpay sync.

AI must recommend and provide evidence; it must not make employment or financial decisions automatically.

## 14. Data storage

### Persistent MongoDB models

| Model | File | Purpose |
| --- | --- | --- |
| `ContactInquiry` | `models/ContactInquiry.ts` | Public contact/lead enquiries |
| `ProjectAssignment` | `models/ProjectAssignment.ts` | Project assignment history/current assignment |
| `AutomationRun` | `models/AutomationRun.ts` | Automation execution records |
| `UserProfile` | `models/UserProfile.ts` | Organization profile schema, role, department, team, title, password hash, bio, links, avatar |
| `Order` | `models/Order.ts` | Compatibility order endpoint model |
| `Subscriber` | `models/Subscriber.ts` | Compatibility subscription endpoint model |

### Development workspace store

`lib/workspace-store.ts` currently seeds ten example profiles, notifications, and message previews in memory.

This means:

- seeded data is available immediately for local demonstration;
- data can disappear when the development server restarts;
- notifications and message previews are not yet persistent production records;
- new user profile passwords are not yet fully migrated to database-backed authentication;
- production deployment must complete the persistence migration before relying on this for real company data.

### Production persistence work required

Before launch:

1. Seed or invite users into `UserProfile`.
2. Use database queries instead of the global workspace store.
3. Add `organizationId` to every business model and query.
4. Add indexes and uniqueness constraints.
5. Add migrations and backup/restore procedures.
6. Store profile images in object storage rather than large base64 values.
7. Persist notifications, messages, and read receipts.

## 15. API inventory

### Authentication

- `POST /api/auth/sign-in`
- `POST /api/auth/sign-out`
- `GET /api/auth/session`

### Public operations

- `POST /api/contact`
- `POST /api/order`
- `POST /api/subscribe`
- `POST /api/chat`

### Workspace operations

- `POST /api/projects/assign`
- `GET /api/team/users`
- `POST /api/team/users`
- `GET /api/team/profile`
- `PATCH /api/team/profile`
- `GET /api/notifications`
- `PATCH /api/notifications`
- `GET /api/messages`

Every protected endpoint should verify the signed session before reading or mutating workspace data.

## 16. Folder structure

```text
app/
  page.tsx                         Public homepage
  about/ services/ insights/       Public content pages
  contact/ privacy/ terms/         Public utility pages
  sign-in/                         Authentication UI
  dashboard/                       Protected workspace UI
    page.tsx                       Company command center
    layout.tsx                     Shared inbox/profile shell
    team/page.tsx                  Team directory
    profile/page.tsx               Self-service profile editor
    [section]/page.tsx             Role-gated section pages
  api/                             Next.js API route handlers

components/
  PublicHome.tsx                   Public home composition
  PublicPage.tsx                   Public inner page composition
  ContactForm.tsx                  Real contact form
  TeamDirectory.tsx                Team listing and add-member modal
  ProfileEditor.tsx                Self-service profile editor
  WorkspaceInbox.tsx               Notifications and message drawer
  AssignProjectButton.tsx          Project assignment action

lib/
  access.ts                         RBAC section access
  role-profiles.ts                  Role dashboard focus definitions
  auth-session.ts                   Signed session cookies
  password.ts                       PBKDF2 password hashing
  workspace-store.ts                Development fallback/seed data
  automation.ts                     Automation catalog and run recording
  mongodb.ts                        MongoDB connector export

models/
  ContactInquiry.ts
  ProjectAssignment.ts
  AutomationRun.ts
  UserProfile.ts

  Order.ts / Subscriber.ts           Compatibility models

public/
  company-logo.jpg                  Company logo asset
```

## 17. Deployment guide

### Recommended Render setup

This repository includes `render.yaml` so Render can create the service from a
Blueprint. Render runs the Next.js app as a Node web service.

#### Before deploying

1. Push the project to GitHub or GitLab.
2. Create a MongoDB Atlas database. Do not use
   `mongodb://localhost:27017/studyprohelp` on Render.
3. Create a MongoDB Atlas database user and configure network access for the
   deployed service. For an initial deployment, `0.0.0.0/0` can be used with a
   strong database password; tighten network access later.
4. Replace all demo emails, passwords, phone numbers, and placeholder contact
   values before going live.

#### Deploy with the Blueprint

1. In Render, choose **New > Blueprint**.
2. Connect the repository containing this project.
3. Render detects `render.yaml` and creates the web service.
4. Enter the values requested for the `sync: false` environment variables.
5. Deploy and wait for the build to complete.

#### Manual Render settings

If you do not use the Blueprint, create **New > Web Service** with:

| Setting | Value |
| --- | --- |
| Runtime | Node |
| Build command | `npm install && npm run build` |
| Start command | `npm start` |
| Node version | `20` or newer |
| Health check path | `/` |

#### Render environment variables

Add these in Render's **Environment** page. Do not commit real values to Git.

```text
MONGODB_URI=mongodb+srv://<database-user>:<database-password>@<cluster-host>/studyprohelp?retryWrites=true&w=majority
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=<sending-gmail-address>
SMTP_APP_PASSWORD=<google-app-password>
OWNER_NOTIFICATION_EMAIL=<owner-gmail-address>
MANAGER_NOTIFICATION_EMAIL=<manager-gmail-address>
ADDITIONAL_NOTIFICATION_EMAILS=<person-1@gmail.com>,<person-2@gmail.com>,<person-3@gmail.com>
AUTH_SESSION_SECRET=<long-random-production-secret>
AUTH_OWNER_EMAIL=<owner-email>
AUTH_OWNER_PASSWORD=<strong-owner-password>
AUTH_MANAGER_EMAIL=<manager-email>
AUTH_MANAGER_PASSWORD=<strong-manager-password>
AUTH_EMPLOYEE_EMAIL=<employee-email>
AUTH_EMPLOYEE_PASSWORD=<strong-employee-password>
AUTH_FINANCE_EMAIL=<finance-email>
AUTH_FINANCE_PASSWORD=<strong-finance-password>
AUTH_HR_EMAIL=<hr-email>
AUTH_HR_PASSWORD=<strong-hr-password>
AUTH_CLIENT_EMAIL=<client-email>
AUTH_CLIENT_PASSWORD=<strong-client-password>
NEXT_PUBLIC_SITE_URL=https://<your-service>.onrender.com
NEXT_PUBLIC_CONTACT_EMAIL=<public-contact-email>
NEXT_PUBLIC_CONTACT_PHONE=<public-contact-phone>
NEXT_PUBLIC_WHATSAPP=<public-whatsapp-number>
NEXT_PUBLIC_EMAIL=<public-support-email>
NEXT_PUBLIC_PHONE=<public-phone-number>
```

Add optional AI or integration variables only when the related integration is
actually configured:

```text
ANTHROPIC_API_KEY=<anthropic-api-key>
OPENAI_API_KEY=<openai-api-key>
GOOGLE_CLIENT_ID=<google-client-id>
GOOGLE_CLIENT_SECRET=<google-client-secret>
GOOGLE_ADS_CLIENT_ID=<google-ads-client-id>
META_ACCESS_TOKEN=<meta-access-token>
TWILIO_ACCOUNT_SID=<twilio-account-sid>
TWILIO_AUTH_TOKEN=<twilio-auth-token>
RAZORPAY_KEY_ID=<razorpay-key-id>
RAZORPAY_KEY_SECRET=<razorpay-key-secret>
STRIPE_SECRET_KEY=<stripe-secret-key>
STRIPE_WEBHOOK_SECRET=<stripe-webhook-secret>
```

#### `.env` rules

- Use `.env.local` for local development. The redundant root `.env` file was
  removed; do not recreate it while `.env.local` exists.
- Use Render's Environment page for production values.
- `.env.example` is a template only; it contains no production credentials.
- Never put passwords, database URLs, session secrets, or API keys in a
  `NEXT_PUBLIC_*` variable.
- `.env`, `.env.local`, and `.env.*.local` are excluded by `.gitignore`.
- Restart or redeploy after changing environment variables.
- Rotate any secret that was ever committed, pasted publicly, or shared with
  someone who should not have access.

#### Deployment verification

After deployment, test:

```text
https://<your-service>.onrender.com/
https://<your-service>.onrender.com/sign-in
https://<your-service>.onrender.com/robots.txt
https://<your-service>.onrender.com/sitemap.xml
```

Confirm that unauthenticated visitors cannot access the dashboard, contact
enquiries work, each intended role can sign in, and the browser console has no
production errors. If you add a custom domain later, update
`NEXT_PUBLIC_SITE_URL` to the final HTTPS domain and redeploy.

### Recommended setup: Vercel + MongoDB Atlas

1. Create a GitHub repository and push the project.
2. Create a MongoDB Atlas project and database user.
3. Restrict Atlas network access appropriately; do not use an unrestricted database user in production.
4. Import the GitHub repository into Vercel.
5. Set the Vercel framework to Next.js if it is not detected automatically.
6. Add production environment variables in Vercel Project Settings.
7. Set `NEXT_PUBLIC_SITE_URL` to the real HTTPS domain.
8. Use a strong production `AUTH_SESSION_SECRET`.
9. Replace all development account credentials.
10. Deploy and run smoke tests for public pages, sign-in, role restrictions, profile editing, contact submission, and project assignment.
11. Connect a custom domain.
12. Configure monitoring, database backups, error alerts, and log retention.

Vercel is suitable for the current Next.js web/API foundation. MongoDB Atlas is suitable for managed data storage. For long-running workers, queues, scheduled jobs, or heavier integration processing, use Render, DigitalOcean App Platform, or a dedicated worker service rather than relying only on short request handlers.

### Production checklist

- [ ] Production MongoDB Atlas database created.
- [ ] Users migrated from environment accounts.
- [ ] Profile, notification, message, and automation data persisted.
- [ ] Organization/tenant filters applied to every model.
- [ ] HTTPS custom domain enabled.
- [ ] Production secrets configured only in hosting secret storage.
- [ ] MFA enabled or implemented.
- [ ] Password reset and invitation flow implemented.
- [ ] Rate limiting enabled.
- [ ] CSP/security headers configured.
- [ ] Database backups tested.
- [ ] Error monitoring enabled.
- [ ] Email sender configured and verified.
- [ ] Third-party OAuth integrations reviewed.
- [ ] Privacy policy and data retention policy reviewed by the client.

## 18. Security model

Current protections include:

- signed HTTP-only session cookie;
- server-side role checks;
- protected dashboard routes;
- password hashing for newly created profile passwords;
- no passwords returned from profile APIs;
- environment secrets excluded by `.gitignore`;
- HTTPS-only link validation for profile links;
- input length limits on API data;
- human approval principle for external, financial, and employment-sensitive actions.

Before production, add or verify:

- MFA;
- account lockout and login rate limiting;
- password reset tokens;
- session revocation;
- CSRF strategy for state-changing requests;
- security headers and CSP;
- upload storage scanning;
- tenant isolation tests;
- IDOR tests;
- audit logs for profile, permission, finance, and external communication actions;
- data retention and deletion workflows.

## 19. Pricing the project in India

These are commercial recommendations for selling the current codebase and scope, not fixed market rules.

### Suggested project packages

| Package | What it includes | Suggested price |
| --- | --- | ---: |
| Demonstration / UI MVP | Public website, dashboard UI, seeded roles, local setup | ₹1.5 lakh–₹3 lakh |
| Current polished MVP | Website, authentication, role-aware dashboard, team directory, profile editor, notifications, project assignment, APIs, README, deployment assistance | ₹3.5 lakh–₹6 lakh |
| Production internal platform | Current MVP plus persistent users, MongoDB migration, backups, MFA, audit logs, testing, monitoring, real email, production deployment | ₹6 lakh–₹10 lakh |
| Multi-tenant SaaS phase | Organization isolation, custom roles, ABAC, client portal, finance workflows, integrations, AI tools, queues, observability | ₹12 lakh–₹25 lakh+ |

For this current repository, a reasonable client quote is **₹5.5 lakh for the polished MVP**, excluding hosting, paid APIs, domain, email provider, WhatsApp/Twilio, payment gateway fees, and future integrations.

### Recommended payment plan

- 30% advance before development/handover work.
- 40% after authentication, dashboard, roles, and profile workflows are accepted.
- 30% after production deployment, documentation, and handover.

### Maintenance pricing

Charge separately for ongoing support:

- Basic maintenance: ₹20,000–₹30,000/month.
- Production support with backups, monitoring, fixes, and small improvements: ₹40,000–₹60,000/month.
- Integrations and major features: quote separately per milestone.

Do not sell the current fallback store as a finished enterprise database. Price the persistence migration and security hardening as part of the production package.

### Client contract items

The proposal should explicitly state:

- source-code ownership and delivery;
- hosting and third-party API costs paid by the client;
- number of revision rounds;
- supported browsers and devices;
- uptime and support expectations;
- data migration scope;
- security responsibilities;
- what counts as a new feature;
- backup and recovery responsibility;
- AI provider usage costs;
- deployment and handover acceptance criteria.

## 20. Known limitations

The following are intentionally not claimed as complete:

- full CRM CRUD and database-backed pipeline;
- full project/task/milestone database workflows;
- complete finance, invoice, payment, tax, and reconciliation system;
- real-time chat;
- Gmail, Google Calendar, Google Drive, WhatsApp, Twilio, Google Ads, Meta Ads, Analytics, Search Console, Slack, and Teams connections;
- production-grade AI tool-calling and provider abstraction;
- complete audit log coverage;
- complete multi-tenant isolation;
- MFA and password reset;
- persistent notification/message storage;
- production object-storage profile images;
- background workers and scheduled job infrastructure.

These should be delivered as separately tested phases rather than represented by static placeholder screens.

## 21. Testing and validation

Run:

```bash
npm.cmd run build
```

The build validates compilation, TypeScript, route generation, and production bundling.

Manual smoke tests:

1. Open the public homepage.
2. Open `/sign-in`.
3. Sign in with a configured development account.
4. Verify the role-specific navigation.
5. Open `/dashboard/team`.
6. Verify the ten seeded profiles.
7. Open `/dashboard/profile`.
8. Save a bio and HTTPS profile link.
9. Open notifications and mark one read.
10. Open messages.
11. Test a forbidden role route.
12. Test mobile width and keyboard navigation.

## 22. Cleanup and retained files

Unused academic-template components, HTML pages, and the old archive zip were removed after checking the active import graph.

The root-level API/model compatibility files remain because current Next.js API wrappers still import them. They are functional dependencies, not unused files.

`MASTER_PROMPT.md` remains as the product requirements reference.

## 23. Useful references

- [Vercel plans](https://vercel.com/docs/plans)
- [MongoDB Atlas pricing](https://www.mongodb.com/pricing)
- [Render pricing](https://render.com/pricing)
- [DigitalOcean App Platform pricing](https://docs.digitalocean.com/products/app-platform/details/pricing/)
- [Next.js documentation](https://nextjs.org/docs)

## 24. Final handover summary

This project currently provides:

- a public L. R. Tech Solutions website;
- protected sign-in and signed sessions;
- role-aware dashboard navigation;
- ten seeded example team profiles;
- self-service profile customization;
- owner/manager/HR team creation flow;
- project assignment action;
- notifications and message preview drawer;
- contact enquiry API;
- automation catalog and run recording foundation;
- MongoDB models for important business records;
- responsive dashboard UI;
- deployment and commercial handover documentation.

Deploy only after completing the production checklist and clearly scoping the remaining limitations with the client.
