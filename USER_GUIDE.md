# RiskINTEGRA Internal Audit Management Suite™
## Executive User Guide & Operations Manual
**Zenith Pension Custodian Limited (ZPC)**  
*Approved for Chief Audit Executive (CAE), Board Audit & Risk Committee (BARC), and Internal Audit Teams*  
*Compliant with PENCOM Guidelines, Section 63 PRA 2014, and IIA Global Standards*

---

## 1. Executive Summary & Core Philosophy

**RiskINTEGRA Internal Audit™** is a continuous, risk-based internal audit and governance platform built specifically for Pension Fund Custodians operating under the **National Pension Commission (PENCOM)** and **Central Bank of Nigeria (CBN)** regulatory frameworks.

Unlike static auditing tools, RiskINTEGRA actively bridges **Enterprise Risk Management (ERM)** with **Internal Audit**, ensuring that audit plans dynamically align with custodial loss ledgers, key risk indicators (KRIs), and sovereign market fluctuations.

---

## 2. Role-Based Access Control & User Directory

When accessing the system, your capabilities and approval permissions are governed by your assigned institutional profile:

| Executive Profile | Key Capabilities & Authorization Levels |
| :--- | :--- |
| **Chief Audit Executive (CAE)** | Full executive override, approval of Annual Audit Plans, sign-off on Working Papers, Board Report Deck generation, and cross-system ERM bridge authorization. |
| **Security Administrator** | Manage identity settings, user roles, and security policies. |
| **Audit Manager** | Plan and oversee audits, assign team members, and manage audit programs. |
| **Auditor** | Conduct audits, execute tests, document working papers, and draft findings. |
| **Control / Risk Owner** | First-line business owners who verify control implementations and execute remediation plans. |
| **Executive Viewer** | Read-only access across board reports, compliance scorecards, and dashboards. |

---

## 3. Navigation & Core Modules

The application is structured into **14 Specialized Modules** accessible via the left sidebar:

### 📊 1. Executive Dashboard
* **Purpose**: High-level real-time overview of the audit universe.
* **Key Metrics Displayed**:
  * **Total Assets Under Custody (AUC) Audited**: Continuous tracking of institutional custody assets (e.g., ₦18.45 Trillion).
  * **PFC Statutory Capital Adequacy**: Live tracking against PENCOM capital requirements.
  * **Audit Plan Completion Rate**: Percentage of scheduled vs. executed engagements across Q1–Q4.
  * **Open Audit Findings & Exceptions**: Breakdown by severity (Critical, High, Medium, Low).
* **Interactive Elements**: Live charts for audit coverage across departments (Settlements, Fixed Income Custody, Contribution Reconciliation, IT Security, Regulatory Legal).

### 🏛️ 2. Master Data & Audit Universe
* **Purpose**: Comprehensive repository of all auditable entities within Zenith Pension Custodian.
* **Key Actions**: View custodial risk ratings, inherent risk scores, and historical audit frequency for each operational unit.

### 📅 3. Annual Audit Plan (Risk-Based)
* **Purpose**: Dynamic scheduling and resource allocation across the calendar year.
* **Key Actions**: Filter engagements by quarter (Q1–Q4) or department. Add new engagements directly into the timeline based on shifting risk profiles.

### 🎯 4. Risk-Based Audit Planning & Scoring
* **Purpose**: Quantitative risk assessment engine that prioritizes audit focus.
* **Algorithm**: Uses a weighted matrix combining **Impact (1–5)**, **Likelihood (1–5)**, **Control Effectiveness (1–5)**, and **Regulatory Scrutiny** to generate a priority score.

### 📋 5. Audit Engagements & Fieldwork
* **Purpose**: Execution lifecycle for individual audit engagements.
* **Workflow Statuses**: Planned ➔ In Progress ➔ Under Review ➔ Completed.
* **Features**: Assign team leads, allocate budgeted audit hours vs. actual hours spent, and attach terms of reference.

### 📝 6. Audit Programs & Test Procedures
* **Purpose**: Step-by-step testing scripts for field auditors.
* **Actions**: Mark procedures as *Passed*, *Failed*, or *Not Applicable*. Link failed procedures directly to formal audit findings.

### 📁 7. Working Papers & Evidence Vault
* **Purpose**: Secure digital binder for audit documentation, reconciliation snapshots, and audit evidence.
* **Security**: Sign-off workflow where Field Auditors submit, Team Leads verify, and the CAE approves.

### 🚩 8. Findings Management & Exception Log
* **Purpose**: Tracking and adjudication of audit exceptions and internal control deficiencies.
* **Fields**: Finding Title, Risk Rating, Root Cause Analysis, Management Response, and Agreed Implementation Date.

### ⏳ 9. Action Tracking & Verification
* **Purpose**: Post-audit monitoring of management remediation commitments.
* **Status Tracking**: Monitor open remediation items, request progress updates, and execute closure verification tests.

### 🛡️ 10. Internal Controls Library
* **Purpose**: Centralized catalog of custodial internal controls across COSO domains.
* **Mapping**: Links controls directly to specific custodial risks (e.g., Dual-authorization on inter-bank settlement instructions).

### ⚖️ 11. Compliance & PENCOM Regs
* **Purpose**: Statutory regulatory checklist ensuring adherence to:
  * **PENCOM Section 63 minimum capital adequacy guidelines**.
  * **CBN Circulars & Guidelines** on Foreign Exchange and Money Market settlement operations.

### ⚡ 12. Continuous Auditing & Fraud Prevention
* **Purpose**: Automated anomaly detection and continuous custodial monitoring.
* **Alerts**: Flags unusual after-hours settlement instructions, duplicate payment references, or sudden reconciliatory variance spikes.

### 📄 13. Reports & Committee Decks
* **Purpose**: Automated generation of Board Audit & Risk Committee (BARC) presentations.
* **Export**: Instantly compile quarterly audit summaries, executive sign-off sheets, and exception heatmaps into presentation-ready decks.

### 🔄 14. ERM Sync & Bi-Directional Bridge
* **Purpose**: Real-time integration with the **RiskINTEGRA Enterprise Risk Management (ERM)** platform.
* **Action**: Pull updated Key Risk Indicators (KRIs) and Custodial Loss Ledgers directly into the Audit Risk Universe to automatically adjust audit frequencies.

---

## 4. Interactive Tools & Analytical Engines Guide

RiskINTEGRA Internal Audit™ equips audit teams with specialized, interactive calculation engines and utilities designed to automate audit fieldwork, prioritization, and executive decision-making. Here is a guide to every interactive tool in the application:

### ⚡ 1. Quantitative Risk-Based Priority Matrix Engine (Module 4)
* **What it does**: Dynamically calculates and ranks auditable units from highest risk (`CRITICAL`) to lowest risk (`LOW`) without subjective guesswork.
* **How to use**: Adjust the interactive 1-5 sliders for Impact, Likelihood, and Control Deficit on any custodial department and click **Calculate Priority**. The system instantly recalculates priority rankings!

### 💱 2. Multi-Currency Valuation & Live Exchange Ticker Tool (Topbar)
* **What it does**: A real-time currency conversion tool integrated directly into the utility Topbar for executive reporting to international parent companies and regulatory bodies.
* **How to use**: Click the currency button (e.g., **`💱 NGN`**) at any time. Every financial chart, Total Assets Under Custody figure, and statutory capital requirement instantly converts into **USD ($)**, **EUR (€)**, or **GBP (£)** using the live exchange rates!

### 🛠️ 3. Findings & Risk Matrix Adjudicator (Module 8)
* **What it does**: An interactive finding management tool that classifies internal control failures across a severity matrix and assigns corrective ownership.
* **How to use**: Click any finding card to open the Root Cause Analyzer. Use the interactive buttons to change severity between *Critical*, *High*, *Medium*, and *Low*, and set the Agreed Implementation Date.

### ⏱️ 4. Post-Audit Corrective Action Tracker (CAP Engine - Module 9)
* **What it does**: A post-audit monitoring tool that prevents forgotten audit findings by tracking management remediation commitments and verifying closure.
* **How to use**: Filter corrective action plans by status (`Open`, `In Progress`, `Overdue`, `Verified Closed`). Click **Request Update** to send an alert to the responsible departmental head, or click **Verify Closure** once field auditors have re-tested the control!

### 🔒 5. Secure Working Papers Vault & Sign-Off Tool (Module 7)
* **What it does**: A digital evidence binder allowing field auditors to attach reconciliation proofs and initiate multi-tier approvals.
* **How to use**: Click **Attach Evidence** on any working paper to upload bank reconciliation snapshots. Once documented, initiate the 3-Tier Electronic Sign-Off flow.

### 📊 6. One-Click BARC Executive Deck Generator (Module 13)
* **What it does**: An automated presentation tool that eliminates hours of manual slide preparation before Board Audit & Risk Committee meetings.
* **How to use**: Select your reporting quarter and click **Generate BARC Presentation Deck**. The tool compiles audit completion percentages, exception heatmaps, and statutory sign-offs into a presentation-ready executive deck!

### 🛡️ 7. Automated Continuous Auditing & Fraud Sentinel (Module 12)
* **What it does**: An automated monitoring engine running real-time custodial rule checks to detect operational anomalies or exceptions.

---

## 5. How to Switch Between RiskINTEGRA Applications

Zenith Pension Custodian (ZPC) operates two twin institutional governance platforms: the **RiskINTEGRA ERM Suite** and the **RiskINTEGRA Internal Audit Suite**. You can switch between both applications anytime without re-entering your login credentials.

### Step 1: Locate the Ecosystem App Switcher
In the top-right utility bar of your screen, click the **`Switch App`** button. This opens the RiskINTEGRA ecosystem drop-down menu.

### Step 2: Click 'Launch ERM'
Select the partner application. The switcher automatically grabs your active profile, signs you in, and transitions you instantly to the same profile on the partner application!

### Step 3: Customizing Your Target Link (Optional)
If your partner application is hosted on a specific corporate address, click the **`Set Link`** button, paste the URL once into the box, and click **Link**. The app remembers this address across your sessions.

---

## 6. Support & Operations Helpdesk

For technical assistance, license key renewals, or custom regulatory reporting template requests, contact:
* **Licensing Operations**: `licensing@zenithcustodian.com`
* **Internal Audit System Admin**: `cae.office@zenithcustodian.com`
* **Platform Version**: `v3.4.0 (2026 Release)`
