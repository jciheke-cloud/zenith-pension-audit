# 📋 RiskINTEGRA Internal Audit Suite™ — Zenith Pensions Custodian
## Institutional User & Audit Governance Guide (PENCOM / IIA Standards)

Welcome to **RiskINTEGRA Internal Audit Suite™**, the specialized internal audit management platform built for **Zenith Pensions Custodian Limited (ZPC)**. This guide explains every module, the step-by-step workflow for each function, the data architecture, and the role-based access model.

---

## 🗄️ 1. Data Architecture — Zero Browser Storage

> **IMPORTANT: All institutional audit data is stored exclusively in the PostgreSQL database hosted on AWS RDS.**
> No audit findings, plans, universe records, working papers, or control data are stored in your browser's localStorage. Your browser only stores a **Cognito session token** in `sessionStorage`, which is automatically cleared when the browser tab closes.

This means:
- Your audit data is accessible from **any authorised device** without transferring files.
- **No data loss** when clearing browser history or switching machines.
- All findings, plans, and records are **instantly persisted** to the central database.
- Every action is logged to the immutable **Zero-Trust Audit Log** table.

---

## 🔐 2. Authentication & Role-Based Access

### Step-by-Step: Logging In
1. Open the Audit Portal URL in your browser.
2. Enter your **corporate email address** and **password** issued by your ZPC System Administrator.
3. Click **Sign In**. The system authenticates via **AWS Cognito** and establishes a secure session.
4. If this is your **first login**, you will be prompted to set a new personal password before proceeding.
5. Your role and permissions are automatically applied based on your Cognito user profile.

### Step-by-Step: Password Reset
1. On the login screen, click **Forgot Password?**
2. Enter your corporate email address.
3. You will receive a **6-digit OTP code** by email from the AWS Cognito system.
4. Enter the code and your new password on the confirmation screen.
5. You are automatically logged in after a successful reset.

### Available Roles
| Role | Description |
|---|---|
| Platform Administrator | Full system access, user management, purge |
| Chief Audit Executive (CAE) | Full read/write across all modules |
| Audit Manager | Full read/write except platform admin actions |
| Senior Auditor | Edit findings, working papers, controls, reviews |
| Auditor | Log findings and working papers |
| Quality Assurance | Review and edit testing and controls |
| ERM Risk Manager | Edit KRI / risk sync, continuous monitoring |
| Auditee / Department Head | Edit action plans on their own findings only |
| Committee / Board Viewer | Read-only access, no edits |

---

## 📊 3. Audit Dashboard

**Purpose:** Central command view of active audit workload, open findings, plans, and key risk indicators.

**Step-by-Step:**
1. After login, the dashboard loads automatically.
2. Review the **Summary KPI Cards**: Open Findings, Active Plans, High-Priority Items, and Overdue Actions.
3. Click any KPI card to navigate directly to the relevant module.
4. Use the **ERM Sync** section to trigger a live synchronisation of risk data from the RiskINTEGRA ERM Suite into the Audit Library modules.

---

## 🗺️ 4. Audit Universe (Master Data)

**Purpose:** Define and maintain the complete inventory of auditable business processes and units within ZPC.

### Step-by-Step: Adding a Single Auditable Unit
1. Navigate to **Master Data** from the left sidebar.
2. Click **+ Add Auditable Unit**.
3. Fill in the Department, Process Name, Inherent Risk Score (1-10), Financial Exposure Score (1-10), and Regulatory Impact Score (1-10).
4. Click **Save**. The record is immediately persisted to the `audit_universe` database table.
5. The system automatically calculates a weighted **Overall Audit Priority Score**.

### Step-by-Step: Bulk Importing Audit Universe
1. Navigate to **Master Data**.
2. Click the **📥 Bulk Import Units** button in the page header.
3. Click **📄 Download CSV Template** to get the pre-formatted import template.
4. Open the template in Excel or Google Sheets and populate your auditable units. Required columns:
   - `department`, `processName`, `inherentRisk` (1-10), `financialExposure` (1-10), `regulatoryImpact` (1-10), `priority`, `lastAuditDate`, `leadAuditor`
5. Save the file as `.csv` (Comma Separated Values).
6. Drag and drop the file into the upload modal's drop zone, or click **Browse File** to select it.
7. A **Data Preview Table** renders the parsed rows — review for any errors before committing.
8. Click **✅ Import Records**. All rows are inserted into the database in a single atomic transaction.
9. A success notification confirms the count of imported records.

### Step-by-Step: Editing / Deleting a Unit
1. Click the **Edit (✏️)** icon on any row to update the unit's details inline.
2. Click the **Delete (🗑️)** icon to permanently remove the unit (requires Audit Manager or higher role).
3. All changes are logged to the audit trail.

---

## 📋 5. Audit Findings Management

**Purpose:** Log, track, escalate, and close formal audit observations arising from executed engagements.

### Step-by-Step: Logging a New Finding
1. Navigate to **Findings Management** from the sidebar.
2. Click **+ Log New Finding**.
3. Fill in the required fields:
   - **Business Unit / Department** (the auditee)
   - **Observation** (describe the finding clearly)
   - **Criteria** (the policy, standard, or regulation being breached)
   - **Root Cause** (underlying reason for the finding)
   - **Likelihood** (1-10 scale) and **Impact** (1-10 scale)
4. The system automatically computes the **Residual Risk Score** (Likelihood × Impact, out of 100) and classifies the **Priority**: Critical (≥80), High (≥60), Medium (≥30), Low (<30).
5. Enter the **Management Response** and target **Remediation Date**.
6. Click **Save Finding**. The record is persisted to the `audit_findings` database table.
7. An automatic **ERM Sync notification** is triggered to link the finding to the ZPC ERM Risk Register.

### Step-by-Step: Bulk Importing Findings
1. Navigate to **Findings Management**.
2. Click the **📥 Bulk Import Findings** button.
3. Click **📄 Download CSV Template**. Required columns:
   - `findingNumber`, `businessUnit`, `observation`, `criteria`, `rootCause`, `likelihood` (1-10), `impact` (1-10), `status`, `managementResponse`, `remediationDate`, `auditor`
4. Populate the template and save as `.csv`.
5. Drag the file into the upload modal, review the data preview, and click **✅ Import Records**.
6. All findings are inserted atomically into the database.

### Step-by-Step: Updating a Finding Status
1. Click on any finding row in the table to expand it.
2. Change the **Status** field (Open → In Progress → Resolved → Closed).
3. Add any remediation notes.
4. Click **Update**. The change is immediately saved to the database.

---

## 📅 6. Annual Audit Plan

**Purpose:** Plan, schedule, and track all audit engagements for the financial year in compliance with IIA and PENCOM audit planning standards.

### Step-by-Step: Creating an Audit Engagement
1. Navigate to **Annual Audit Plan** from the sidebar.
2. Click **+ New Audit Engagement**.
3. Fill in:
   - **Engagement Name** (e.g., "Q1 Treasury & ALM Audit")
   - **Department** (the auditee)
   - **Start Date** and **End Date**
   - **Planned Hours** (total budgeted audit hours)
   - **Lead Auditor**
   - **Status** (Draft, Approved, In Progress, Completed)
4. Click **Save Plan**. The engagement is persisted to the `audit_plans` database table.

### Step-by-Step: Bulk Importing Plans
1. Navigate to **Annual Audit Plan**.
2. Click **📥 Bulk Import Plans**.
3. Download the CSV template. Required columns:
   - `auditName`, `department`, `startDate`, `endDate`, `plannedHours`, `leadAuditor`, `status`
4. Populate and upload — identical flow to other bulk import modules.

### Step-by-Step: Updating a Plan
1. Click **Edit** on an existing plan.
2. Update the **Status**, **Actual Hours**, or any other field.
3. Click **Update**. The change is saved to the database.

---

## 📁 7. Working Papers & Evidence

**Purpose:** Upload, manage, and link audit evidence documentation to specific engagements or findings.

### Step-by-Step: Uploading a Working Paper
1. Navigate to **Working Papers** from the sidebar.
2. Click **+ Upload Working Paper**.
3. Enter the Paper Title, Reference Number, and link it to an Audit Plan or Finding.
4. Upload the supporting file attachment.
5. Click **Save**. The record is persisted to the database.

---

## 🔄 8. ERM Suite Synchronisation

**Purpose:** Pull live risk data from the RiskINTEGRA ERM Suite directly into Audit Library modules.

### Step-by-Step: Triggering an ERM Sync
1. Navigate to **ERM Sync** from the sidebar.
2. Click **🔄 Sync from ERM Suite**. The system fetches the latest enterprise risks from the backend database.
3. Risks are automatically transformed into **Audit Universe entries** and grouped by department.
4. Review the sync results in the module and click **Confirm & Save** to accept the imported data.

---

## 📊 9. Regulatory Reviews & Continuous Monitoring

**Purpose:** Track PENCOM statutory regulatory reviews and manage continuous assurance monitoring exceptions.

### Step-by-Step: Logging a Regulatory Review
1. Navigate to **Regulatory Reviews**.
2. Click **+ New Review**.
3. Select the Regulation (PENCOM ICT Guidelines, COSO, ISO 31000, etc.), enter review scope, findings, and status.
4. Click **Save**. The review is persisted to the database.

### Step-by-Step: Logging a Continuous Exception
1. Navigate to **Continuous Monitoring**.
2. Click **+ Log Exception**.
3. Enter the exception type, affected process, and severity.
4. Assign an owner and due date for resolution.
5. Click **Save**.

---

## 🛡️ 10. User Management (Platform Administrators Only)

**Purpose:** Provision and manage user accounts for the Audit Portal.

### Step-by-Step: Creating a New User
1. Log in as a **Platform Administrator**.
2. Navigate to **User Management**.
3. Click **+ Create New User**.
4. Enter name, corporate email, department, ERM Role, and Audit Role.
5. Set **App Scope**: ERM only, Audit only, or Both.
6. Click **Create Account**. The user is provisioned in AWS Cognito and can log in immediately.

### Step-by-Step: Deactivating / Deleting a User
1. Find the user in the directory table.
2. Click the action dropdown → **Suspend Account** or **Delete Account**.
3. The action is logged to the Zero-Trust Audit Logs.

---

## 🌐 11. Institutional Deployment

| Item | Detail |
|---|---|
| **ERM Suite URL** | https://zpc.riskintegra-erm.nayandjoerisktechconsulting.com |
| **Audit Portal URL** | https://zpc.riskintegra-audit.nayandjoerisktechconsulting.com/audit-portal/index.html#/ |
| **API Gateway** | https://uhzosq0g0i.execute-api.eu-west-1.amazonaws.com/prod/ |
| **Database** | PostgreSQL on AWS RDS (eu-west-1) |
| **Auth** | AWS Cognito User Pool: `eu-west-1_xWeVdtgCi` |

---

## 🔐 12. Security Architecture

| Feature | Detail |
|---|---|
| Authentication | AWS Cognito with JWT access tokens |
| Session storage | `sessionStorage` only — cleared on tab/browser close |
| Data storage | PostgreSQL on AWS RDS (no browser storage for business data) |
| Transmission | All API calls use HTTPS/TLS |
| Audit trail | Immutable `system_audit_logs` table (WORM pattern) |
| Role-based access | 14 Audit roles enforced at UI and API level |
| Auto-logout | 30 minutes inactivity timeout |
| Password policy | Enforced by AWS Cognito (complexity + OTP reset) |

---

*For support, contact your ZPC System Administrator or email `licensing@zenithcustodian.com`.*
