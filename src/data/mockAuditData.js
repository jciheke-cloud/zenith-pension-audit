// Master Structure & Institutional Roles Definitions for Zenith Pension Custodian (ZPC) Audit Management Application
// RiskINTEGRA Audit™ - Zero-Trust Institutional Ecosystem (No Mock Data)

export const INITIAL_BUSINESS_UNITS = [
  { id: 'bu-1', code: 'BU-CUST-01', name: 'Custody Operations & Asset Servicing', head: 'Head of Custody Operations', staffCount: 25, riskLevel: 'High', coverage: 100, status: 'Active' },
  { id: 'bu-2', code: 'BU-SETT-02', name: 'Settlements, Clearing & Money Market', head: 'Head of Settlements', staffCount: 18, riskLevel: 'High', coverage: 100, status: 'Active' },
  { id: 'bu-3', code: 'BU-CONT-03', name: 'Contribution Reconciliation & Invoicing', head: 'Head of Contribution Reconciliation', staffCount: 20, riskLevel: 'High', coverage: 100, status: 'Active' },
  { id: 'bu-4', code: 'BU-ACCT-04', name: 'Fund Accounting & Net Asset Valuation (NAV)', head: 'Head of Fund Accounting', staffCount: 16, riskLevel: 'High', coverage: 100, status: 'Active' },
  { id: 'bu-5', code: 'BU-RISK-05', name: 'Risk Management & Compliance', head: 'Head of Risk & Compliance', staffCount: 14, riskLevel: 'Medium', coverage: 100, status: 'Active' },
  { id: 'bu-6', code: 'BU-IT-06', name: 'Information Technology & Cybersecurity', head: 'Head of IT & Cybersecurity', staffCount: 22, riskLevel: 'High', coverage: 100, status: 'Active' },
  { id: 'bu-7', code: 'BU-AUD-07', name: 'Internal Audit & Assurance', head: 'Chief Audit Executive (CAE)', staffCount: 10, riskLevel: 'Low', coverage: 100, status: 'Active' },
  { id: 'bu-8', code: 'BU-LGL-08', name: 'Legal & Company Secretarial', head: 'Head of Legal', staffCount: 8, riskLevel: 'Medium', coverage: 100, status: 'Active' },
  { id: 'bu-9', code: 'BU-HR-09', name: 'Human Resources & Administration', head: 'Head of HR & Admin', staffCount: 12, riskLevel: 'Low', coverage: 100, status: 'Active' },
  { id: 'bu-10', code: 'BU-FIN-10', name: 'Finance & Corporate Planning', head: 'Head of Finance', staffCount: 14, riskLevel: 'Medium', coverage: 100, status: 'Active' },
  { id: 'bu-11', code: 'BU-CRM-11', name: 'Client Relationship & Pension Services', head: 'Head of Pension Services', staffCount: 18, riskLevel: 'Medium', coverage: 100, status: 'Active' },
  { id: 'bu-12', code: 'BU-EXEC-12', name: 'Executive Management & Governance', head: 'Managing Director / CEO', staffCount: 6, riskLevel: 'Medium', coverage: 100, status: 'Active' }
];

export const INITIAL_AUDIT_UNIVERSE = [];

export const INITIAL_ANNUAL_AUDIT_PLANS = [
  {
    id: 'plan-1',
    planId: 'PLAN-2026-01',
    auditName: 'Q3 Custody Operations & Fee Sweep Audit',
    department: 'Custody Operations',
    plannedHours: 120,
    actualHours: 45,
    status: 'Draft',
    startDate: '2026-07-01',
    endDate: '2026-09-30',
    leadAuditor: 'Lead Senior Auditor'
  }
];

export const INITIAL_AUDIT_PROGRAMS = [
  {
    id: 'AP-01',
    name: 'Custody Operations Standard Audit Program',
    title: 'Custody Operations Standard Audit Program',
    category: 'Core Custody',
    iiaRef: '2200 / 2300',
    cosoComponent: 'Control Activities',
    procedures: [
      { id: 'PROC-01', ref: 'CUST-01', step: 'Verify RTGS inflow sweeps to PFC within 24 hours.', expectedControl: 'Automated 24hr sweep', sampleSize: '25 Transactions', riskLink: 'High', status: 'Pending' }
    ]
  }
];

export const INITIAL_WORKING_PAPERS = [
  {
    id: 'WP-101',
    title: 'Q3 Custody Fee Sweep Reconciliation',
    fileName: 'q3_custody_fee_sweep_reconciliation.xlsx',
    fileType: 'Excel Workbook (.xlsx)',
    linkedAudit: 'Q3 Custody Operations & Fee Sweep Audit',
    uploadedBy: 'Lead Senior Auditor',
    samplingMethod: 'Risk-based',
    populationSize: '2,450',
    sampleSize: '25',
    checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    status: 'Verified'
  }
];

export const INITIAL_FINDINGS = [
  {
    id: 'FND-2026-004',
    findingNumber: 'FND-2026-004',
    businessUnit: 'Custody Operations',
    observation: 'Delayed Sweeping of Contribution Funds',
    criteria: 'Funds must be swept within 24 hours per PenCom guidelines.',
    rootCause: 'Manual processing delays during peak volumes.',
    likelihood: 4,
    impact: 4,
    residualRisk: 16,
    priority: 'High',
    severity: 'High',
    status: 'In Progress',
    managementResponse: 'Automated sweep script will be deployed.',
    remediationDate: '2026-08-15',
    auditor: 'Lead Senior Auditor'
  },
  {
    id: 'FND-2026-005',
    findingNumber: 'FND-2026-005',
    businessUnit: 'Information Technology',
    observation: 'Missing Dual Authorization on Firewall Rule Changes',
    criteria: 'ISO 27001 Access Control Policy',
    rootCause: 'System configuration error after migration.',
    likelihood: 3,
    impact: 5,
    residualRisk: 15,
    priority: 'High',
    severity: 'Medium',
    status: 'Awaiting Validation',
    managementResponse: 'Rule updated to enforce maker-checker.',
    remediationDate: '2026-07-20',
    auditor: 'IT Auditor'
  }
];

export const INITIAL_INTERNAL_CONTROLS = [];

export const INITIAL_REGULATORY_REVIEWS = [];

export const INITIAL_FRAUD_CASES = [];

export const INITIAL_CONTINUOUS_EXCEPTIONS = [];

export const ROLES_LIST = [
  { id: 'Platform_Administrator', name: 'Platform Administrator', badge: 'Full Admin', access: 'Full system configuration and administration' },
  { id: 'Security_Administrator', name: 'Security Administrator', badge: 'Security Admin', access: 'Identity, roles, and security settings' },
  { id: 'Chief_Risk_Officer', name: 'Chief Risk Officer (CRO)', badge: 'Executive Oversight', access: 'Enterprise risk oversight and approvals' },
  { id: 'Chief_Audit_Executive', name: 'Chief Audit Executive (CAE)', badge: 'Audit Oversight', access: 'Audit oversight and reporting' },
  { id: 'Risk_Manager', name: 'Risk Manager', badge: 'Risk Register Lead', access: 'Manage enterprise risk register and assessments' },
  { id: 'Risk_Owner', name: 'Risk Owner', badge: 'First Line Risk', access: 'Manage assigned risks and responses' },
  { id: 'Control_Owner', name: 'Control Owner', badge: 'First Line Control', access: 'Maintain and attest to controls' },
  { id: 'Audit_Manager', name: 'Audit Manager', badge: 'Audit Management', access: 'Plan and oversee audits' },
  { id: 'Auditor', name: 'Auditor', badge: 'Field Audit Lead', access: 'Conduct audits and document findings' },
  { id: 'Compliance_Officer', name: 'Compliance Officer', badge: 'Compliance Lead', access: 'Manage compliance obligations' },
  { id: 'Department_Manager', name: 'Department Manager', badge: 'Division Head', access: 'View and manage departmental records' },
  { id: 'Action_Owner', name: 'Action Owner', badge: 'Remediation Owner', access: 'Complete assigned remediation actions' },
  { id: 'Executive_Viewer', name: 'Executive Viewer', badge: 'Board / Executive', access: 'Read-only access across board reports & dashboards' },
  { id: 'External_Auditor', name: 'External Auditor', badge: 'External Assurance', access: 'Restricted read-only verification access' }
];

export const MOCK_USERS = [];

// Enforced template injection to support Phase 1-3 testing
