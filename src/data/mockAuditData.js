// Comprehensive Master Data for Zenith Pension Custodian (ZPC) Audit Management Application
// RiskINTEGRA Audit™ - Integrated with RiskINTEGRA ERM Ecosystem

export const INITIAL_BUSINESS_UNITS = [
  { id: 'bu-1', name: 'Operations', head: 'Head of Operations', code: 'OPS', staffCount: 42, riskLevel: 'High', coveragePct: 92 },
  { id: 'bu-2', name: 'Treasury', head: 'Head of Treasury', code: 'TRS', staffCount: 18, riskLevel: 'High', coveragePct: 95 },
  { id: 'bu-3', name: 'Custody Operations', head: 'Head of Custody Operations', code: 'CUS', staffCount: 56, riskLevel: 'Critical', coveragePct: 100 },
  { id: 'bu-4', name: 'Investment Settlement', head: 'Head of Investment Settlement', code: 'INV', staffCount: 24, riskLevel: 'High', coveragePct: 94 },
  { id: 'bu-5', name: 'Finance', head: 'Chief Financial Officer', code: 'FIN', staffCount: 30, riskLevel: 'Medium', coveragePct: 88 },
  { id: 'bu-6', name: 'ICT', head: 'Head of ICT & Systems', code: 'ICT', staffCount: 35, riskLevel: 'Critical', coveragePct: 96 },
  { id: 'bu-7', name: 'Information Security', head: 'Chief Information Security Officer', code: 'SEC', staffCount: 15, riskLevel: 'Critical', coveragePct: 100 },
  { id: 'bu-8', name: 'Compliance', head: 'Chief Compliance Officer', code: 'CMP', staffCount: 20, riskLevel: 'Medium', coveragePct: 90 },
  { id: 'bu-9', name: 'Risk Management', head: 'Head of Risk Management', code: 'RSK', staffCount: 16, riskLevel: 'Medium', coveragePct: 92 },
  { id: 'bu-10', name: 'Human Resources', head: 'Head of Human Resources', code: 'HRD', staffCount: 18, riskLevel: 'Low', coveragePct: 82 },
  { id: 'bu-11', name: 'Legal', head: 'Head of Legal & Governance', code: 'LEG', staffCount: 12, riskLevel: 'Medium', coveragePct: 85 },
  { id: 'bu-12', name: 'Procurement', head: 'Head of Procurement', code: 'PRC', staffCount: 14, riskLevel: 'Medium', coveragePct: 80 }
];

export const INITIAL_AUDIT_UNIVERSE = [
  {
    id: 'au-101',
    processName: 'Benefit Payments Verification & Disbursement',
    businessUnit: 'Operations',
    code: 'OPS-BEN-01',
    inherentRisk: 9,
    financialExposure: 9,
    regulatoryImpact: 10,
    previousFindings: 7,
    fraudExposure: 8,
    itDependency: 8,
    lastAudited: '2025-11-15',
    frequency: 'Quarterly',
    leadAuditor: 'Lead Senior Auditor'
  },
  {
    id: 'au-102',
    processName: 'Asset Safekeeping & Electronic Vault Custody',
    businessUnit: 'Custody Operations',
    code: 'CUS-SAF-01',
    inherentRisk: 10,
    financialExposure: 10,
    regulatoryImpact: 10,
    previousFindings: 6,
    fraudExposure: 7,
    itDependency: 9,
    lastAudited: '2025-12-10',
    frequency: 'Monthly',
    leadAuditor: 'Audit Manager'
  },
  {
    id: 'au-103',
    processName: 'Daily Cash Reconciliation & PFA Sweep Pool',
    businessUnit: 'Custody Operations',
    code: 'CUS-CSH-02',
    inherentRisk: 9,
    financialExposure: 10,
    regulatoryImpact: 9,
    previousFindings: 8,
    fraudExposure: 8,
    itDependency: 9,
    lastAudited: '2026-01-20',
    frequency: 'Monthly',
    leadAuditor: 'Audit Manager'
  },
  {
    id: 'au-104',
    processName: 'Investment Trade Settlement & DVP Processing',
    businessUnit: 'Investment Settlement',
    code: 'INV-SET-01',
    inherentRisk: 8,
    financialExposure: 9,
    regulatoryImpact: 9,
    previousFindings: 5,
    fraudExposure: 7,
    itDependency: 8,
    lastAudited: '2025-10-05',
    frequency: 'Quarterly',
    leadAuditor: 'Senior IT Auditor'
  },
  {
    id: 'au-105',
    processName: 'Corporate Actions & Dividend Collection',
    businessUnit: 'Investment Settlement',
    code: 'INV-COR-02',
    inherentRisk: 7,
    financialExposure: 8,
    regulatoryImpact: 8,
    previousFindings: 6,
    fraudExposure: 6,
    itDependency: 7,
    lastAudited: '2025-08-14',
    frequency: 'Semi-Annually',
    leadAuditor: 'Senior IT Auditor'
  },
  {
    id: 'au-106',
    processName: 'Client Reporting & PFA Valuation Statements',
    businessUnit: 'Custody Operations',
    code: 'CUS-REP-03',
    inherentRisk: 6,
    financialExposure: 7,
    regulatoryImpact: 9,
    previousFindings: 4,
    fraudExposure: 3,
    itDependency: 9,
    lastAudited: '2025-09-22',
    frequency: 'Quarterly',
    leadAuditor: 'Lead Senior Auditor'
  },
  {
    id: 'au-107',
    processName: 'Cyber Security Architecture & Privileged Access',
    businessUnit: 'Information Security',
    code: 'SEC-CYB-01',
    inherentRisk: 10,
    financialExposure: 9,
    regulatoryImpact: 10,
    previousFindings: 8,
    fraudExposure: 9,
    itDependency: 10,
    lastAudited: '2026-02-01',
    frequency: 'Quarterly',
    leadAuditor: 'Senior Risk Analyst (IT Audit Lead)'
  },
  {
    id: 'au-108',
    processName: 'Vendor Management & Outsourced IT SLA Oversight',
    businessUnit: 'Procurement',
    code: 'PRC-VEN-01',
    inherentRisk: 6,
    financialExposure: 6,
    regulatoryImpact: 7,
    previousFindings: 6,
    fraudExposure: 7,
    itDependency: 6,
    lastAudited: '2025-07-11',
    frequency: 'Annually',
    leadAuditor: 'QA Auditor'
  },
  {
    id: 'au-109',
    processName: 'Business Continuity & Disaster Recovery Readiness',
    businessUnit: 'Risk Management',
    code: 'RSK-BCP-01',
    inherentRisk: 8,
    financialExposure: 8,
    regulatoryImpact: 9,
    previousFindings: 5,
    fraudExposure: 2,
    itDependency: 10,
    lastAudited: '2025-11-28',
    frequency: 'Annually',
    leadAuditor: 'Senior Risk Analyst (IT Audit Lead)'
  },
  {
    id: 'au-110',
    processName: 'Treasury Money Market & FX Placement Controls',
    businessUnit: 'Treasury',
    code: 'TRS-MMF-01',
    inherentRisk: 9,
    financialExposure: 10,
    regulatoryImpact: 8,
    previousFindings: 6,
    fraudExposure: 8,
    itDependency: 7,
    lastAudited: '2025-12-18',
    frequency: 'Quarterly',
    leadAuditor: 'Audit Manager'
  },
  {
    id: 'au-111',
    processName: 'Physical Security & Vault Dual-Custody Access',
    businessUnit: 'Operations',
    code: 'OPS-PHY-02',
    inherentRisk: 7,
    financialExposure: 8,
    regulatoryImpact: 8,
    previousFindings: 3,
    fraudExposure: 6,
    itDependency: 5,
    lastAudited: '2025-06-19',
    frequency: 'Annually',
    leadAuditor: 'QA Auditor'
  },
  {
    id: 'au-112',
    processName: 'PenCom Monthly Returns & Regulatory Reporting',
    businessUnit: 'Compliance',
    code: 'CMP-PEN-01',
    inherentRisk: 8,
    financialExposure: 7,
    regulatoryImpact: 10,
    previousFindings: 5,
    fraudExposure: 3,
    itDependency: 8,
    lastAudited: '2026-01-15',
    frequency: 'Quarterly',
    leadAuditor: 'Lead Senior Auditor'
  }
];

export const INITIAL_ANNUAL_AUDIT_PLANS = [
  {
    id: 'PLAN-2026-01',
    auditName: 'Q1 Comprehensive Benefit Payments & Biometric Verification Audit',
    department: 'Operations',
    riskRating: 'High',
    frequency: 'Quarterly',
    estimatedHours: 320,
    actualHours: 310,
    leadAuditor: 'Senior Auditor',
    teamMembers: ['QA Auditor', 'Staff Auditor'],
    plannedStartDate: '2026-01-10',
    plannedEndDate: '2026-02-15',
    budget: 14.5, // ₦ Millions
    status: 'Completed',
    auditRating: 'Satisfactory',
    findingsCount: 3
  },
  {
    id: 'PLAN-2026-02',
    auditName: 'Q1 Custodial Asset Safekeeping & Reconciliation Assurance',
    department: 'Custody Operations',
    riskRating: 'Critical',
    frequency: 'Monthly',
    estimatedHours: 450,
    actualHours: 465,
    leadAuditor: 'Audit Manager',
    teamMembers: ['Senior IT Auditor', 'Field Auditor'],
    plannedStartDate: '2026-01-25',
    plannedEndDate: '2026-03-05',
    budget: 22.0,
    status: 'Completed',
    auditRating: 'Needs Improvement',
    findingsCount: 5
  },
  {
    id: 'PLAN-2026-03',
    auditName: 'Q1/Q2 Cyber Security & Privileged Account Access Review',
    department: 'Information Security',
    riskRating: 'Critical',
    frequency: 'Quarterly',
    estimatedHours: 380,
    actualHours: 290,
    leadAuditor: 'Senior Risk Analyst',
    teamMembers: ['IT Auditor', 'Audit Manager'],
    plannedStartDate: '2026-03-01',
    plannedEndDate: '2026-04-30',
    budget: 18.5,
    status: 'In Progress',
    auditRating: 'Pending',
    findingsCount: 4
  },
  {
    id: 'PLAN-2026-04',
    auditName: 'Investment Settlement & Corporate Action SLA Compliance',
    department: 'Investment Settlement',
    riskRating: 'High',
    frequency: 'Quarterly',
    estimatedHours: 280,
    actualHours: 150,
    leadAuditor: 'Senior IT Auditor',
    teamMembers: ['QA Auditor'],
    plannedStartDate: '2026-03-15',
    plannedEndDate: '2026-05-10',
    budget: 12.0,
    status: 'In Progress',
    auditRating: 'Pending',
    findingsCount: 2
  },
  {
    id: 'PLAN-2026-05',
    auditName: 'Treasury FX & Money Market Counterparty Limit Inspection',
    department: 'Treasury',
    riskRating: 'High',
    frequency: 'Quarterly',
    estimatedHours: 260,
    actualHours: 0,
    leadAuditor: 'Audit Manager',
    teamMembers: ['Senior Auditor'],
    plannedStartDate: '2026-05-15',
    plannedEndDate: '2026-06-30',
    budget: 11.5,
    status: 'Approved',
    auditRating: 'Pending',
    findingsCount: 0
  },
  {
    id: 'PLAN-2026-06',
    auditName: 'PenCom Monthly Reporting Adherence & Valuation Audit',
    department: 'Compliance',
    riskRating: 'High',
    frequency: 'Quarterly',
    estimatedHours: 220,
    actualHours: 0,
    leadAuditor: 'Senior Auditor',
    teamMembers: ['Field Auditor'],
    plannedStartDate: '2026-06-01',
    plannedEndDate: '2026-07-15',
    budget: 9.8,
    status: 'Approved',
    auditRating: 'Pending',
    findingsCount: 0
  },
  {
    id: 'PLAN-2026-07',
    auditName: 'ICT Core Custody System Database Governance Review',
    department: 'ICT',
    riskRating: 'Critical',
    frequency: 'Semi-Annually',
    estimatedHours: 350,
    actualHours: 0,
    leadAuditor: 'Senior Risk Analyst',
    teamMembers: ['IT Auditor'],
    plannedStartDate: '2026-07-01',
    plannedEndDate: '2026-08-20',
    budget: 16.0,
    status: 'Approved',
    auditRating: 'Pending',
    findingsCount: 0
  },
  {
    id: 'PLAN-2026-08',
    auditName: 'Annual Vendor SLA & Cloud Outsourcing Governance Audit',
    department: 'Procurement',
    riskRating: 'Medium',
    frequency: 'Annually',
    estimatedHours: 180,
    actualHours: 0,
    leadAuditor: 'QA Auditor',
    teamMembers: ['Staff Auditor'],
    plannedStartDate: '2026-08-05',
    plannedEndDate: '2026-09-10',
    budget: 7.5,
    status: 'Draft',
    auditRating: 'Pending',
    findingsCount: 0
  },
  {
    id: 'PLAN-2026-09',
    auditName: 'Disaster Recovery Vault Failover & BCP Simulation Audit',
    department: 'Risk Management',
    riskRating: 'High',
    frequency: 'Annually',
    estimatedHours: 300,
    actualHours: 0,
    leadAuditor: 'Senior Risk Analyst',
    teamMembers: ['Senior IT Auditor', 'Audit Manager'],
    plannedStartDate: '2026-09-15',
    plannedEndDate: '2026-10-31',
    budget: 14.0,
    status: 'Draft',
    auditRating: 'Pending',
    findingsCount: 0
  },
  {
    id: 'PLAN-2026-10',
    auditName: 'Q3 Custody Operations & Client Asset Segregation Audit',
    department: 'Custody Operations',
    riskRating: 'Critical',
    frequency: 'Quarterly',
    estimatedHours: 400,
    actualHours: 0,
    leadAuditor: 'Audit Manager',
    teamMembers: ['Senior Auditor', 'Field Auditor'],
    plannedStartDate: '2026-10-01',
    plannedEndDate: '2026-11-15',
    budget: 19.0,
    status: 'Draft',
    auditRating: 'Pending',
    findingsCount: 0
  }
];

export const INITIAL_AUDIT_PROGRAMS = [
  {
    id: 'PROG-BEN-01',
    title: 'Benefit Payment & Biometric Verification Audit Program',
    category: 'Operations',
    objectives: 'To verify that all pension benefit disbursements comply strictly with PenCom Revised Guidelines, are supported by biometrically authenticated RSA holders, and undergo dual authorization prior to settlement.',
    procedures: [
      { id: 'p1', ref: 'BEN-PROC-01', step: '1. Sample 50 benefit payment files across Retirement, Death, and Voluntary Contribution categories from Q1 2026.', sampleSize: '50 Files (100% Q1 Batch)', riskLink: 'Settlement & Disbursement Risk', expectedControl: 'Valid PenCom approval letter and biometric verification slip attached to each file.', evidenceRequired: 'Scanned PenCom approval batch and NIMC/Biometric match log.', status: 'Tested - Pass', findingRef: null },
      { id: 'p2', ref: 'BEN-PROC-02', step: '2. Verify that bank account names match exactly with the RSA beneficiary records without manual override.', sampleSize: '100% Automated API Audit', riskLink: 'Fraud & Misappropriation Risk', expectedControl: 'Automated NIBSS Name Verification API blocks mismatched transfers.', evidenceRequired: 'NIBSS inquiry response logs and core banking exception report.', status: 'Tested - Exception', findingRef: 'FND-2026-003' },
      { id: 'p3', ref: 'BEN-PROC-03', step: '3. Inspect Maker/Checker authorization timestamps in the custodial settlement gateway.', sampleSize: '45 Settlement Batches', riskLink: 'Operational & SoD Risk', expectedControl: 'Separate Maker and Checker user IDs with minimum 15-minute review interval.', evidenceRequired: 'System audit logs from Custody Settlement Gateway.', status: 'Tested - Pass', findingRef: null }
    ]
  },
  {
    id: 'PROG-CUS-02',
    title: 'Custodial Asset Safekeeping & Three-Way Reconciliation Program',
    category: 'Custody Operations',
    objectives: 'To ensure that physical and electronic pension assets held on behalf of PFAs are accurately recorded, fully segregated from custodial corporate assets, and reconciled daily against CSCS and CBN records.',
    procedures: [
      { id: 'p4', ref: 'CUS-PROC-01', step: '1. Perform three-way reconciliation between ZPC General Ledger, PFA Portfolio Valuation, and CSCS/CBN depository statements for Q1.', sampleSize: '90 Daily Statements (Q1)', riskLink: 'Custodial Safekeeping & Valuation', expectedControl: 'Daily automated reconciliation engine generates zero unexplained variance reports.', evidenceRequired: 'Daily 3-way reconciliation sign-off sheets and variance exception logs.', status: 'Tested - Exception', findingRef: 'FND-2026-001' },
      { id: 'p5', ref: 'CUS-PROC-02', step: '2. Inspect nominee account structure at Central Bank of Nigeria (CBN) for strict PFA asset segregation.', sampleSize: '18 Nominee Mandate Files', riskLink: 'Prudential Asset Segregation', expectedControl: 'Distinct nominee accounts registered per PFA with no pooling of custodian corporate funds.', evidenceRequired: 'CBN confirmation letters and nominee account mandates.', status: 'Tested - Pass', findingRef: null },
      { id: 'p6', ref: 'CUS-PROC-03', step: '3. Review manual journal overrides posted to custodial fee accrual accounts.', sampleSize: '25 Manual Journal Vouchers', riskLink: 'Financial Reporting Integrity', expectedControl: 'All manual journals above ₦1,000,000 require Chief Financial Officer sign-off.', evidenceRequired: 'Manual Journal Voucher (MJV) register and approval memos.', status: 'Tested - Exception', findingRef: 'FND-2026-005' }
    ]
  },
  {
    id: 'PROG-SEC-03',
    title: 'Cyber Security & Privileged Database Access Program',
    category: 'Information Security',
    objectives: 'To assess the adequacy of logical access controls, privileged user monitoring, and vulnerability management on the core custodial database and SWIFT settlement terminals.',
    procedures: [
      { id: 'p7', ref: 'SEC-PROC-01', step: '1. Extract active database administrator (DBA) accounts and cross-reference against approved HR staff roster.', sampleSize: '100% DBA Privileged Accounts', riskLink: 'Logical Access & Cyber Risk', expectedControl: 'Only active, certified DBAs have sysadmin privileges; former staff revoked within 2 hours.', evidenceRequired: 'Oracle DB user privilege dump and HR separation notifications.', status: 'Tested - Exception', findingRef: 'FND-2026-002' },
      { id: 'p8', ref: 'SEC-PROC-02', step: '2. Verify that multi-factor authentication (MFA) is strictly enforced for VPN and SWIFT Alliance terminal access.', sampleSize: '30 SWIFT Alliance Sessions', riskLink: 'Network & SWIFT Security', expectedControl: 'Hardware token MFA mandatory for all internal/external administrative sessions.', evidenceRequired: 'Cisco ISE authentication logs and SWIFT security audit trail.', status: 'Tested - Pass', findingRef: null }
    ]
  }
];

export const INITIAL_WORKING_PAPERS = [
  {
    id: 'WP-2026-101',
    title: 'Q1 Benefit Payment Biometric Verification Sample Testing Workbook',
    auditId: 'PLAN-2026-01',
    auditName: 'Q1 Comprehensive Benefit Payments Audit',
    findingId: 'FND-2026-003',
    controlId: 'CTL-OPS-012',
    riskId: 'RSK-OPS-004',
    owner: 'Senior Auditor',
    fileType: 'Excel',
    fileName: 'Benefit_Payment_Sample_Q1_2026_Tested.xlsx',
    fileSize: '4.2 MB',
    uploadDate: '2026-02-04',
    status: 'Supervisor Signed-Off',
    notes: 'Sample of 50 benefit payments across 6 PFAs. Identified 2 instances of manual override where NIBSS name check timed out but payment proceeded.'
  },
  {
    id: 'WP-2026-102',
    title: 'Three-Way Reconciliation Variance Summary & CSCS Statements',
    auditId: 'PLAN-2026-02',
    auditName: 'Q1 Custodial Asset Safekeeping Audit',
    findingId: 'FND-2026-001',
    controlId: 'CTL-CUS-001',
    riskId: 'RSK-CUS-001',
    owner: 'Audit Manager',
    fileType: 'PDF',
    fileName: 'CSCS_CBN_Reconciliation_Variance_Report_Feb2026.pdf',
    fileSize: '8.7 MB',
    uploadDate: '2026-02-18',
    status: 'QA Approved',
    notes: 'Detailed breakdown of ₦42.5M temporary settlement variance caused by T+2 corporate action dividend processing timing.'
  },
  {
    id: 'WP-2026-103',
    title: 'Oracle Database Administrator Privilege Dump & HR Roster Match',
    auditId: 'PLAN-2026-03',
    auditName: 'Q1/Q2 Cyber Security & Access Review',
    findingId: 'FND-2026-002',
    controlId: 'CTL-SEC-008',
    riskId: 'RSK-SEC-002',
    owner: 'Senior Risk Analyst',
    fileType: 'Word',
    fileName: 'DBA_Privilege_Audit_Matrix_March2026.docx',
    fileSize: '1.9 MB',
    uploadDate: '2026-03-12',
    status: 'Under Review',
    notes: 'Cross-tabulation showing 2 external vendor accounts retaining superuser DB roles 3 weeks past contract conclusion.'
  },
  {
    id: 'WP-2026-104',
    title: 'SLA Exceptions Register for Investment Trade Settlements',
    auditId: 'PLAN-2026-04',
    auditName: 'Investment Settlement & Corporate Action Audit',
    findingId: 'FND-2026-004',
    controlId: 'CTL-INV-005',
    riskId: 'RSK-INV-003',
    owner: 'Senior IT Auditor',
    fileType: 'Excel',
    fileName: 'Settlement_SLA_Exceptions_Q1_2026.xlsx',
    fileSize: '3.1 MB',
    uploadDate: '2026-03-22',
    status: 'Draft',
    notes: 'Analysis of 14 trades where custodian settlement confirmation was sent >4 hours after NGX closing window.'
  }
];

export const INITIAL_FINDINGS = [
  {
    findingNumber: 'FND-2026-001',
    auditId: 'PLAN-2026-02',
    auditName: 'Q1 Custodial Asset Safekeeping Audit',
    businessUnit: 'Custody Operations',
    observation: 'Unreconciled Cash Sweep Variance of ₦42.5 Million between Core Custody Ledger and CBN Nominee Account due to delayed automated corporate action dividend posting.',
    rootCause: 'The automated SWIFT MT564 dividend confirmation interface lacks a retry queue for weekend corporate action announcements, causing manual posting backlogs on Monday mornings.',
    risk: 'Potential misreporting of daily PFA unit net asset value (NAV), breach of PenCom custody valuation SLAs, and potential regulatory sanctions.',
    controlWeakness: 'Detective control CTL-CUS-001 (Daily Automated 3-Way Reconciliation) alerted the variance but lacked automated escalation to Head of Operations within 4 hours.',
    impact: 9,
    likelihood: 8,
    residualRisk: 72, // 9 x 8
    severity: 'High',
    priority: 'High',
    recommendation: 'Implement an automated weekend SWIFT MT564/MT568 parsing daemon with auto-retry logic and mandate auto-escalation SMS/Email alerts to the Chief Audit Executive and Head of Custody if variance persists beyond 2 hours.',
    managementResponse: 'Agreed. ICT and Custody Operations will upgrade the SWIFT messaging interface to build an auto-retry queue and configure instant SMS alerts for any unposted corporate action above ₦5 Million.',
    owner: 'Head of Custody Operations',
    targetDate: '2026-08-30',
    status: 'Open',
    evidence: 'CSCS_CBN_Reconciliation_Variance_Report_Feb2026.pdf',
    closureApproval: 'Pending Verification',
    isRepeat: true,
    repeatCycle: '3rd Consecutive Cycle (Repeated from Q3 2025 and Q4 2025)',
    ermRiskRef: 'RSK-OPS-001 (Custodial Asset Misappropriation & Reconciliation Error)'
  },
  {
    findingNumber: 'FND-2026-002',
    auditId: 'PLAN-2026-03',
    auditName: 'Q1/Q2 Cyber Security & Privileged Account Access Review',
    businessUnit: 'Information Security',
    observation: 'Retention of Superuser / SYSDBA Privileges on Oracle Core Custodial Database by two former external application support engineers 21 days post contract termination.',
    rootCause: 'Absence of an automated offboarding API trigger between the Procurement Vendor Management portal and Active Directory / Oracle Identity Manager.',
    risk: 'Unauthorized access to confidential RSA pensioner balances, potential data exfiltration, or malicious database table manipulation.',
    controlWeakness: 'Preventive control CTL-SEC-008 (Privileged User Access Deprovisioning) relies on manual email notifications from HR/Procurement rather than systemic de-activation.',
    impact: 10,
    likelihood: 7,
    residualRisk: 70, // 10 x 7
    severity: 'High',
    priority: 'High',
    recommendation: 'Enforce automated identity lifecycle provisioning via CyberArk/SailPoint linked directly to contract expiration dates. Conduct immediate manual revocation and forensic log review of the 2 accounts.',
    managementResponse: 'The two vendor accounts were disabled immediately during audit fieldwork. Procurement and ICT have initiated procurement of an enterprise Identity & Access Management (IAM) bridge.',
    owner: 'Chief Information Security Officer (Head, Info Security)',
    targetDate: '2026-07-31',
    status: 'In Progress',
    evidence: 'DBA_Privilege_Audit_Matrix_March2026.docx',
    closureApproval: 'Pending Verification',
    isRepeat: true,
    repeatCycle: 'Repeated from 2025 Annual IT Audit',
    ermRiskRef: 'RSK-CYB-002 (Privileged User Account Compromise & Unauthorized Access)'
  },
  {
    findingNumber: 'FND-2026-003',
    auditId: 'PLAN-2026-01',
    auditName: 'Q1 Comprehensive Benefit Payments Audit',
    businessUnit: 'Operations',
    observation: 'Manual Override of NIBSS Account Name Verification for two death benefit lumpsum disbursements totaling ₦18.4 Million due to gateway timeout without supervisory exception approval.',
    rootCause: 'Operations processing staff utilized the "Emergency Gateway Bypass" flag during NIBSS peak-hour downtime to meet the 48-hour SLA without obtaining digital Checker sign-off.',
    risk: 'Misdirection of pension benefit lumpsums to fraudulent bank accounts, non-compliance with PenCom Anti-Money Laundering (AML) directives, and financial liability for ZPC.',
    controlWeakness: 'Preventive control CTL-OPS-012 allowed single-factor bypass when API response latency exceeded 30 seconds.',
    impact: 8,
    likelihood: 6,
    residualRisk: 48, // 8 x 6
    severity: 'Medium',
    priority: 'Medium',
    recommendation: 'Configure the core banking application to strictly forbid single-user NIBSS bypasses. Require dual Maker-Checker digital approval and mandatory attachment of physical bank confirmation letter for any override above ₦2 Million.',
    managementResponse: 'System parameters have been updated to block single-user bypass. Operations staff have undergone retraining on PenCom AML compliance.',
    owner: 'Head of Operations',
    targetDate: '2026-06-15',
    status: 'Awaiting Validation',
    evidence: 'Benefit_Payment_Sample_Q1_2026_Tested.xlsx',
    closureApproval: 'Submitted for CAE Sign-off',
    isRepeat: false,
    repeatCycle: 'New Finding',
    ermRiskRef: 'RSK-OPS-004 (Pension Benefit Payment Fraud & Verification Bypass)'
  },
  {
    findingNumber: 'FND-2026-004',
    auditId: 'PLAN-2026-04',
    auditName: 'Investment Settlement & Corporate Action SLA Compliance',
    businessUnit: 'Investment Settlement',
    observation: 'SLA Breach: 14 Fixed Income Trade Settlement confirmations issued over 4 hours past the 2:00 PM NGX / FMDQ depository cutoff window.',
    rootCause: 'Manual trade ticket entry from PFA instruction emails rather than straight-through processing (STP) via FIX protocol connection.',
    risk: 'Potential trade fails, settlement penalties from FMDQ/CSCS, and reputational friction with contracted Pension Fund Administrators.',
    controlWeakness: 'Operating effectiveness of CTL-INV-005 (Real-time PFA Trade Instruction Matching) degraded during high-volume treasury bill auctions.',
    impact: 7,
    likelihood: 7,
    residualRisk: 49, // 7 x 7
    severity: 'Medium',
    priority: 'Medium',
    recommendation: 'Complete the STP API onboarding for all top-5 contracted PFAs to eliminate manual email ticket transcription.',
    managementResponse: 'API integration with 3 PFAs completed; final 2 PFAs scheduled for Q3 deployment.',
    owner: 'Head of Investment Settlement (Head, Investment Settlement)',
    targetDate: '2026-09-30',
    status: 'In Progress',
    evidence: 'Settlement_SLA_Exceptions_Q1_2026.xlsx',
    closureApproval: 'Pending Verification',
    isRepeat: false,
    repeatCycle: 'New Finding',
    ermRiskRef: 'RSK-FIN-003 (Counterparty Trade Settlement Failure & SLA Breach)'
  },
  {
    findingNumber: 'FND-2026-005',
    auditId: 'PLAN-2026-02',
    auditName: 'Q1 Custodial Asset Safekeeping Audit',
    businessUnit: 'Custody Operations',
    observation: 'Posting of 5 Manual Journal Vouchers (MJVs) adjusting PFA custodial fee accruals without physical signature or digital memo attachment.',
    rootCause: 'Staff familiarity and informal verbal approvals from unit supervisors during month-end financial closing rush.',
    risk: 'Inaccurate custodial revenue recognition, potential earnings manipulation, and audit trail non-compliance.',
    controlWeakness: 'Detective control CTL-FIN-009 (Journal Voucher Post-Posting Review) occurred 15 days in arrears.',
    impact: 6,
    likelihood: 6,
    residualRisk: 36, // 6 x 6
    severity: 'Medium',
    priority: 'Medium',
    recommendation: 'Automate journal voucher attachment enforcement in the ERP system so no manual journal can be committed without an uploaded PDF mandate.',
    managementResponse: 'Agreed. ERP validation script deployed on May 1st enforcing mandatory document attachment.',
    owner: 'Chief Financial Officer',
    targetDate: '2026-05-30',
    status: 'Closed',
    evidence: 'MJV_Audit_Trail_Verification_May2026.pdf',
    closureApproval: 'Approved by CAE on 2026-06-02',
    isRepeat: false,
    repeatCycle: 'New Finding',
    ermRiskRef: 'RSK-FIN-001 (Financial Reporting & Journal Entry Misstatement)'
  }
];

export const INITIAL_INTERNAL_CONTROLS = [
  {
    id: 'CTL-CUS-001',
    code: 'CTL-CUS-001',
    name: 'Daily Automated 3-Way Custodial Reconciliation Engine',
    businessUnit: 'Custody Operations',
    type: 'Detective',
    designEffectiveness: 'Adequate',
    operatingEffectiveness: 'Ineffective',
    frequency: 'Daily',
    automation: 'Automated',
    owner: 'Head of Custody Operations',
    evidence: 'Daily Reconciliation Logs & Variance Dashboard',
    residualRiskScore: 72,
    notes: 'Engine identifies variance accurately but lacks auto-escalation when weekend SWIFT MT564 messages drop.'
  },
  {
    id: 'CTL-SEC-008',
    code: 'CTL-SEC-008',
    name: 'Privileged User Access Deprovisioning & IAM Review',
    businessUnit: 'Information Security',
    type: 'Preventive',
    designEffectiveness: 'Deficient',
    operatingEffectiveness: 'Ineffective',
    frequency: 'Monthly',
    automation: 'Manual',
    owner: 'Chief Information Security Officer',
    evidence: 'Monthly Active Directory & Oracle User Dump Sign-offs',
    residualRiskScore: 70,
    notes: 'Manual email notification process from HR/Procurement causes significant lag in deprovisioning external DBA accounts.'
  },
  {
    id: 'CTL-OPS-012',
    code: 'CTL-OPS-012',
    name: 'Biometric & NIBSS Name Verification Dual-Authorization Gate',
    businessUnit: 'Operations',
    type: 'Preventive',
    designEffectiveness: 'Adequate',
    operatingEffectiveness: 'Effective',
    frequency: 'Per Transaction',
    automation: 'Automated',
    owner: 'Head of Operations',
    evidence: 'NIMC Biometric Match Log & NIBSS Inquiry API Logs',
    residualRiskScore: 48,
    notes: 'Operating effectiveness restored following system configuration blocking single-user emergency bypass.'
  },
  {
    id: 'CTL-INV-005',
    code: 'CTL-INV-005',
    name: 'Real-time PFA Trade Instruction Matching & STP FIX Gateway',
    businessUnit: 'Investment Settlement',
    type: 'Preventive',
    designEffectiveness: 'Adequate',
    operatingEffectiveness: 'Ineffective',
    frequency: 'Continuous',
    automation: 'Hybrid',
    owner: 'Head of Investment Settlement',
    evidence: 'CSCS/FMDQ Trade Confirmation Timestamps vs PFA Mandates',
    residualRiskScore: 49,
    notes: 'STP operational for 3 PFAs; remaining PFAs require manual email ticket transcription during peak hours.'
  },
  {
    id: 'CTL-FIN-009',
    code: 'CTL-FIN-009',
    name: 'ERP Manual Journal Voucher Mandatory Mandate Validation',
    businessUnit: 'Finance',
    type: 'Preventive',
    designEffectiveness: 'Adequate',
    operatingEffectiveness: 'Effective',
    frequency: 'Continuous',
    automation: 'Automated',
    owner: 'Chief Financial Officer',
    evidence: 'ERP Journal Attachment Log & CFO Digital Sign-off Register',
    residualRiskScore: 36,
    notes: 'Fully effective following May deployment of mandatory document upload validation script.'
  }
];

export const INITIAL_REGULATORY_REVIEWS = [
  {
    id: 'REG-2026-01',
    regulatoryBody: 'National Pension Commission (PenCom)',
    reviewTitle: '2025 Annual Risk-Based PenCom Statutory Examination of Custodial Operations',
    inspectionDate: '2026-02-10',
    status: 'In Progress - Validation Stage',
    totalObservations: 6,
    openObservations: 2,
    closedObservations: 4,
    observations: [
      {
        id: 'obs-pen-1',
        title: 'Delayed Notification of PFA Cash Pool Sweep Overdrafts',
        observationText: 'PenCom examiners noted 3 instances where PFA custodial accounts experienced temporary daylight overdrafts exceeding 30 minutes without immediate electronic notification to PenCom Surveillance Department.',
        recommendation: 'Configure instant automated API notification to PenCom regulatory portal whenever any custodial cash account triggers an intraday negative balance.',
        targetDate: '2026-07-31',
        status: 'Open - Retesting',
        evidenceUploaded: 'PenCom_Overdraft_Alert_API_Test_Report.pdf',
        validationResult: 'Retesting scheduled for July 25th by Internal Audit.'
      },
      {
        id: 'obs-pen-2',
        title: 'Enhancement of Custody SLA Archival Accessibility',
        observationText: 'Historical custody agreements for pre-2020 client accounts took >48 hours to retrieve from physical offsite vault.',
        recommendation: 'Digitize all pre-2020 physical custodial agreements and index in the secure electronic document management repository.',
        targetDate: '2026-06-30',
        status: 'Closed - Verified',
        evidenceUploaded: 'SLA_Digitization_Completion_Certificate_May2026.pdf',
        validationResult: 'Internal Audit verified 100% digital index availability on June 15th. Pass.'
      }
    ]
  },
  {
    id: 'REG-2026-02',
    regulatoryBody: 'Central Bank of Nigeria (CBN)',
    reviewTitle: 'CBN Banking Supervision & Custodian FX Placement Inspection',
    inspectionDate: '2026-01-20',
    status: 'Closed - Compliant',
    totalObservations: 3,
    openObservations: 0,
    closedObservations: 3,
    observations: [
      {
        id: 'obs-cbn-1',
        title: 'Daily FX Trade Reporting Timestamp Consistency',
        observationText: 'Minor discrepancy between SWIFT confirmation time and CBN electronic reporting window.',
        recommendation: 'Synchronize NTP server clocks across core banking and treasury dealing terminals.',
        targetDate: '2026-03-31',
        status: 'Closed - Verified',
        evidenceUploaded: 'NTP_Server_Sync_Audit_Log_March2026.pdf',
        validationResult: 'Internal Audit verified zero clock drift across 24 dealing terminals. Pass.'
      }
    ]
  },
  {
    id: 'REG-2026-03',
    regulatoryBody: 'External Audit (PwC Nigeria)',
    reviewTitle: '2025 Statutory Financial & ISAE 3402 Type II Assurance Audit',
    inspectionDate: '2026-03-15',
    status: 'In Progress - Action Plan',
    totalObservations: 4,
    openObservations: 3,
    closedObservations: 1,
    observations: [
      {
        id: 'obs-pwc-1',
        title: 'Disaster Recovery Vault Failover RTO Verification',
        observationText: 'The Recovery Time Objective (RTO) achieved during the November DR simulation was 4 hours 12 minutes against the approved target of 2 hours.',
        recommendation: 'Optimize Oracle Data Guard synchronous replication and conduct a semi-annual surprise failover test in Q3 2026.',
        targetDate: '2026-09-30',
        status: 'Open - Action Plan',
        evidenceUploaded: null,
        validationResult: 'Awaiting Q3 simulation results.'
      }
    ]
  }
];

export const INITIAL_FRAUD_CASES = [
  {
    id: 'CASE-2026-001',
    caseTitle: 'Attempted Unauthorized Reactivation & Disbursement from Dormant RSA Account',
    department: 'Operations & Custody',
    reportedDate: '2026-02-14',
    suspectedActivity: 'An external fraud ring attempted to present forged letters of administration and cloned NIMC biometric slips to withdraw ₦45.2 Million from a deceased RSA holder account dormant since 2022.',
    status: 'Closed - Substantiated & Prevented',
    financialExposure: 45.2, // ₦ Millions
    recoveredAmount: 45.2, // Fully protected/prevented
    leadInvestigator: 'Head of Risk Management (Risk & Fraud Unit)',
    evidence: ['Cloned_NIMC_Slip_Forensic_Analysis.pdf', 'CCTV_Reception_Footage_Feb14.mp4', 'Operations_System_Alert_Log.xlsx'],
    timeline: [
      { date: '2026-02-14 10:15 AM', event: 'Suspect presented documentation at Operations desk for lumpsum withdrawal.' },
      { date: '2026-02-14 10:42 AM', event: 'Automated Continuous Monitoring bot flagged account as "Dormant > 36 Months - High Risk Gate".' },
      { date: '2026-02-14 11:05 AM', event: 'Biometric verification returned 62% match score (below 95% threshold). Checker alerted Fraud Investigation unit.' },
      { date: '2026-02-14 11:30 AM', event: 'Suspect apprehended by ZPC Physical Security and handed over to EFCC.' }
    ],
    summary: 'The multi-layered biometric and dormant account continuous monitoring alerts successfully intercepted and prevented ₦45.2M loss.'
  },
  {
    id: 'CASE-2026-002',
    caseTitle: 'Suspicious Split-Invoice Procurement Billing for Cloud Server Maintenance',
    department: 'Procurement & ICT',
    reportedDate: '2026-04-05',
    suspectedActivity: 'Identification of 4 sequential invoices from vendor "ApexNet Solutions" billed at ₦985,000 each within a 48-hour window, circumventing the ₦1,000,000 mandatory Head of Procurement sign-off threshold.',
    status: 'Under Investigation',
    financialExposure: 3.94,
    recoveredAmount: 0,
    leadInvestigator: 'QA Auditor',
    evidence: ['Invoices_ApexNet_April2026.pdf', 'Procurement_Approval_Timestamp_Log.xlsx'],
    timeline: [
      { date: '2026-04-05 08:30 AM', event: 'Continuous Auditing Exception Bot #07 (Split-Transaction Detection) flagged 4 invoices below ₦1M limit.' },
      { date: '2026-04-06 02:00 PM', event: 'Internal Audit formally subpoenaed email correspondence between Procurement Officer and Vendor.' }
    ],
    summary: 'Investigation active. Payments to ApexNet Solutions frozen pending forensic accounting audit.'
  }
];

export const INITIAL_CONTINUOUS_EXCEPTIONS = [
  { id: 'EX-001', ruleName: 'Dormant RSA Account Disbursement Attempt (>36mo inactive)', department: 'Operations', severity: 'Critical', timestamp: '2026-07-13 11:14 AM', details: 'RSA ID: PEN-88492019 - Lumpsum request of ₦12.4M initiated on dormant account.', status: 'Flagged & Blocked', assignedTo: 'Fraud Unit' },
  { id: 'EX-002', ruleName: 'Late Custody Trade Settlement (>24hr SLA Breach)', department: 'Investment Settlement', severity: 'High', timestamp: '2026-07-13 10:45 AM', details: 'FGN Bond Trade Ref #TB-99201 - Settlement confirmation pending 26 hours past trade date.', status: 'Under Investigation', assignedTo: 'Senior IT Auditor' },
  { id: 'EX-003', ruleName: 'Manual Journal Override on Revenue Accrual Account', department: 'Finance', severity: 'Medium', timestamp: '2026-07-13 09:20 AM', details: 'Journal Voucher #MJV-9918 posted by user CFO without digital PDF mandate attachment.', status: 'Open Exception', assignedTo: 'Senior Auditor' },
  { id: 'EX-004', ruleName: 'Segregation of Duties (SoD) Violation - Maker & Checker Same IP', department: 'Operations', severity: 'Critical', timestamp: '2026-07-12 04:15 PM', details: 'Terminal IP 10.14.22.105 executed Maker (User: Maker User) and Checker (User: Checker User) within 45 seconds.', status: 'Escalated to CAE', assignedTo: 'Senior Risk Analyst' },
  { id: 'EX-005', ruleName: 'Failed Daily Cash Pool Reconciliation Variance > ₦5M', department: 'Custody Operations', severity: 'High', timestamp: '2026-07-12 08:05 AM', details: 'Reconciliation Engine reported ₦8.2M temporary sweep mismatch on PFA Sweep Pool #04.', status: 'Resolved - Corporate Action Posted', assignedTo: 'Audit Manager' }
];

export const ROLES_LIST = [
  { id: 'cae', name: 'Chief Audit Executive (CAE)', badge: 'Executive Authority', access: 'Full Read/Write/Approve/Board Reports' },
  { id: 'manager', name: 'Audit Manager', badge: 'Management', access: 'Manage Plans, Assign Teams, Review Findings' },
  { id: 'senior', name: 'Senior Auditor', badge: 'Field Lead', access: 'Execute Programs, Upload Evidence, Create Findings' },
  { id: 'qa', name: 'Quality Assurance Reviewer', badge: 'QA Assurance', access: 'Validate Working Papers & Control Retesting' },
  { id: 'owner', name: 'Department Head / Process Owner', badge: 'Auditee', access: 'Respond to Findings, Update Action Plans (CAPs)' },
  { id: 'erm', name: 'Risk & Compliance Manager', badge: 'Risk Ecosystem', access: 'View ERM Sync, KRI Linkage, Regulatory Review' },
  { id: 'committee', name: 'Audit Committee Member / Board', badge: 'Board Portal', access: 'Read Board Packs, Approve Annual Plan & Closures' }
];

export const MOCK_USERS = [
  {
    id: 'user-cae',
    name: 'Chief Audit Executive (CAE)',
    email: 'cae@zenithcustodian.com',
    roleId: 'cae',
    title: 'Chief Audit Executive (CAE)',
    department: 'Internal Audit & Governance',
    avatar: 'CA',
    status: 'Online'
  },
  {
    id: 'user-manager',
    name: 'Audit Manager',
    email: 'manager@zenithcustodian.com',
    roleId: 'manager',
    title: 'Audit Manager',
    department: 'Internal Audit - Operations & Custody',
    avatar: 'AM',
    status: 'Online'
  },
  {
    id: 'user-senior',
    name: 'Senior Auditor',
    email: 'senior@zenithcustodian.com',
    roleId: 'senior',
    title: 'Senior Auditor',
    department: 'Internal Audit - IT & Systems',
    avatar: 'SA',
    status: 'Online'
  },
  {
    id: 'user-qa',
    name: 'Quality Assurance Reviewer',
    email: 'qa@zenithcustodian.com',
    roleId: 'qa',
    title: 'Quality Assurance Reviewer',
    department: 'Audit Methodology & QA',
    avatar: 'QA',
    status: 'Online'
  },
  {
    id: 'user-owner',
    name: 'Department Head / Process Owner',
    email: 'owner@zenithcustodian.com',
    roleId: 'owner',
    title: 'Department Head / Process Owner',
    department: 'Custody Operations Department',
    avatar: 'DH',
    status: 'Online'
  },
  {
    id: 'user-erm',
    name: 'Risk & Compliance Manager',
    email: 'erm@zenithcustodian.com',
    roleId: 'erm',
    title: 'Risk & Compliance Manager',
    department: 'Enterprise Risk Management (ERM)',
    avatar: 'RM',
    status: 'Online'
  },
  {
    id: 'user-committee',
    name: 'Audit Committee Member / Board',
    email: 'committee@zenithcustodian.com',
    roleId: 'committee',
    title: 'Audit Committee Chairman / Board',
    department: 'Board Audit & Risk Committee',
    avatar: 'BC',
    status: 'Online'
  }
];
