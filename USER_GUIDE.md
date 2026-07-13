# RiskINTEGRA Internal Audit Management Suite™
## Executive User Guide & Operations Manual
**Zenith Pension Custodian Limited (ZPC)**  
*Approved for Chief Audit Executive (CAE), Board Audit & Risk Committee (BARC), and Internal Audit Teams*  
*Compliant with PENCOM Guidelines, Section 63 PRA 2014, and IIA Global Standards*

---

## 1. Executive Summary & Core Philosophy

**RiskINTEGRA Internal Audit™** is a continuous, risk-based internal audit and governance platform built specifically for Pension Fund Custodians operating under the **National Pension Commission (PENCOM)** and **Central Bank of Nigeria (CBN)** regulatory frameworks.

Unlike static auditing tools, RiskINTEGRA actively bridges **Enterprise Risk Management (ERM)** with **Internal Audit**, ensuring that audit plans dynamically align with custodial loss ledgers, key risk indicators (KRIs), and sovereign market fluctuations (CBN MPR, FGN Bond yields, FX rates).

---

## 2. Role-Based Access Control (RBAC) & Login

When accessing the system, your capabilities and approval permissions are governed by your assigned institutional profile:

| Executive Profile | RBAC Role | Key Capabilities & Authorization Levels |
| :--- | :--- | :--- |
| **Chief Audit Executive (CAE)** | `cae` | Full executive override, approval of Annual Audit Plans, sign-off on Working Papers, Board Report Deck generation, and cross-system ERM bridge authorization. |
| **Senior Audit Manager** | `senior` | Engagement scheduling, review of audit programs and working papers, management exception sign-off, and action tracking oversight. |
| **Audit Team Leader** | `lead` | Fieldwork supervision, test execution validation, finding categorization (High/Medium/Low risk), and evidence attachment review. |
| **Field Auditor / Analyst** | `auditor` | Execution of test procedures, drafting of observation sheets, evidence documentation, and preliminary risk scoring. |

### Quick Login & Role Switching
On the initial login screen, select your mock institutional account or click any of the **Quick Mock Access Profiles** to instantly log in under that specific governance tier. You can also switch roles anytime using the top bar profile selector.

---

## 3. Navigation & Core Modules

The application is structured into **14 Specialized Modules** accessible via the left sidebar:

### 📊 1. Executive Dashboard
* **Purpose**: High-level real-time overview of the audit universe.
* **Key Metrics Displayed**:
  * **Total Assets Under Custody (AUC) Audited**: Continuous tracking of institutional custody assets (e.g., ₦18.45 Trillion).
  * **PFC Statutory Capital Adequacy**: Live tracking against PENCOM Section 63 PRA 2014 thresholds.
  * **Audit Plan Completion Rate**: Percentage of scheduled vs. executed engagements across Q1–Q4.
  * **Open Audit Findings & Exceptions**: Breakdown by severity (Critical, High, Medium, Low).
* **Interactive Elements**: Live charts for audit coverage across departments (Settlements, Fixed Income Custody, Contribution Reconciliation, IT & Cyber, Regulatory Legal).

### 🏛️ 2. Master Data & Audit Universe
* **Purpose**: Comprehensive repository of all auditable entities within Zenith Pension Custodian.
* **Key Actions**: View custodial risk ratings, inherent risk scores, and historical audit frequency for each operational unit.

### 📅 3. Annual Audit Plan (Risk-Based)
* **Purpose**: Dynamic scheduling and resource allocation across the calendar year.
* **Key Actions**: Filter engagements by quarter (Q1–Q4) or department. Add new engagements directly into the timeline based on shifting risk profiles.

### 🎯 4. Risk-Based Audit Planning & Scoring
* **Purpose**: Quantitative risk assessment engine that prioritizes audit focus.
* **Algorithm**: Uses a weighted matrix combining **Impact (1–5)**, **Likelihood (1–5)**, **Control Effectiveness (1–5)**, and **Regulatory Scrutiny** to generate a priority score.
* **Formula**:
  $$\text{Priority Score} = (\text{Impact} \times \text{Likelihood}) \times \left(1 + \frac{5 - \text{Control Score}}{5}\right)$$

### 📋 5. Audit Engagements & Fieldwork
* **Purpose**: Execution lifecycle for individual audit engagements.
* **Workflow Statuses**: `Planned` ➔ `In Progress` ➔ `Under Review` ➔ `Completed`.
* **Features**: Assign team leads, allocate budgeted audit hours vs. actual hours spent, and attach terms of reference.

### 📝 6. Audit Programs & Test Procedures
* **Purpose**: Step-by-step testing scripts for field auditors.
* **Actions**: Mark procedures as *Passed*, *Failed*, or *Not Applicable*. Link failed procedures directly to formal audit findings.

### 📁 7. Working Papers & Evidence Vault
* **Purpose**: Secure digital binder for audit documentation, reconciliation snapshots, and cryptographic evidence.
* **Security**: Sign-off workflow where Field Auditors submit, Team Leads verify, and the CAE approves.

### 🚩 8. Findings Management & Exception Log
* **Purpose**: Tracking and adjudication of audit exceptions and internal control deficiencies.
* **Fields**: Finding Title, Risk Rating, Root Cause Analysis, Management Response, and Agreed Implementation Date.

### ⏳ 9. Action Tracking & Verification
* **Purpose**: Post-audit monitoring of management remediation commitments.
* **Status Tracking**: Monitor open remediation items, request progress updates, and execute closure verification tests.

### 🛡️ 10. Internal Controls Library (ICFR)
* **Purpose**: Centralized catalog of custodial internal controls across COSO domains.
* **Mapping**: Links controls directly to specific custodial risks (e.g., Dual-authorization on inter-bank settlement instructions).

### ⚖️ 11. Compliance & PENCOM Regs
* **Purpose**: Statutory regulatory checklist ensuring adherence to:
  * **PENCOM Section 63 PRA 2014** (Minimum Capital Adequacy & Custody Rules).
  * **CBN Circulars & Guidelines** on Foreign Exchange and Money Market settlement operations.

### ⚡ 12. Fraud & Continuous Auditing
* **Purpose**: Automated anomaly detection and continuous custodial monitoring.
* **Alerts**: Flags unusual after-hours settlement instructions, duplicate SWIFT references, or sudden reconciliatory variance spikes.

### 📄 13. Reports & Committee Decks
* **Purpose**: Automated generation of Board Audit & Risk Committee (BARC) presentations.
* **Export**: Instantly compile quarterly audit summaries, executive sign-off sheets, and exception heatmaps into presentation-ready decks.

### 🔄 14. ERM Sync & Bi-Directional Bridge
* **Purpose**: Real-time integration with the **RiskINTEGRA Enterprise Risk Management (ERM)** platform.
* **Action**: Pull updated Key Risk Indicators (KRIs) and Custodial Loss Ledgers directly into the Audit Risk Universe to automatically adjust audit frequencies.

---

## 4. Using the Unified App Switcher & Bi-Directional SSO

To ensure a seamless executive experience across both corporate governance applications (**Internal Audit** and **ERM**), the platform includes the **RiskINTEGRA Ecosystem Gateway™**:

### Launching the App Switcher
1. Look at the top utility bar (next to the **Currency Selector 💱** and **Live CBN Feeds**).
2. Click the **`Apps ⠿`** button to open the ecosystem grid.
3. You will see both institutional suites:
   * **RiskINTEGRA ERM Suite** (Risk Register, KRIs, PenCom Capital Engine).
   * **RiskINTEGRA Internal Audit** (Your current application).

### Bi-Directional Single Sign-On (SSO)
* When you click **"Launch ERM with active role ➔"** inside the Audit app, the system opens your ERM application while automatically passing your exact security credentials via a cryptographic URL gateway (`?sso_role=cae&sso_token=riskintegra_auth_bridge`).
* The destination app instantly intercepts the token, logs you into the exact same executive tier, and cleans up the address bar automatically!

---

## 5. How to Switch Between RiskINTEGRA Applications

Zenith Pension Custodian (ZPC) operates two twin institutional governance platforms: the **RiskINTEGRA ERM Suite** and the **RiskINTEGRA Internal Audit Suite**. You can switch between both applications anytime without re-entering your login credentials.

### Step 1: Locate the Ecosystem App Switcher
In the top-right utility bar of your screen (right next to the **💱 Currency Selector** and live CBN ticker), click the **`Apps ⠿`** grid icon. This opens the RiskINTEGRA ecosystem drop-down menu.

### Step 2: Click 'Launch ERM with active role ➔'
Select the partner application. The switcher automatically grabs your active executive profile (`cae`, `senior`, `lead`, or `auditor`), generates a secure single sign-on token (`sso_token=riskintegra_auth_bridge`), and transitions you instantly to the exact same role on the partner application!

### Step 3: Customizing Your Target Link (Optional)
If your partner application is hosted on a shared web link or cloud address (such as `https://zpc-erm-demo.netlify.app`), click the small **`⚙️ Set Link`** button at the top-right inside the `Apps ⠿` menu, paste the URL once into the box, and click **Link ✓**. The app remembers this address across your sessions.

---

## 6. Intellectual Property & Domain Protection (`LicenseGuard`)

Both frontend and backend operations are protected by **`LicenseGuard.jsx`**:
* **Domain Whitelisting**: Ensures code only executes on authorized institutional domains (`*.zenithcustodian.com`, `localhost`, `*.netlify.app`).
* **Console Legal Watermark**: Warns against unauthorized inspection or reverse-engineering under the Nigerian Copyright Act.
* **Cryptographic Override**: If triggered on an unauthorized domain, requires the institutional key:
  `RISKINTEGRA-ZPC-2026-ENTERPRISE-PROD`

---

## 7. Support & Operations Helpdesk

For technical assistance, license key renewals, or custom regulatory reporting template requests, contact:
* **Licensing Operations**: `licensing@zenithcustodian.com`
* **Internal Audit System Admin**: `cae.office@zenithcustodian.com`
* **Platform Version**: `v3.4.0-PROD (2026 Release)`
