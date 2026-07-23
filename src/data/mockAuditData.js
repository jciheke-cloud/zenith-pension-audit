// Master Structure & Institutional Roles Definitions for Zenith Pension Custodian (ZPC) Audit Management Application
// RiskINTEGRA Audit™ - Zero-Trust Institutional Ecosystem (No Mock Data)

export const INITIAL_BUSINESS_UNITS = [
  { id: 'bu-1', code: 'BU-CUST-01', name: 'Custody Operations & Asset Servicing', head: 'Nkechi Okolie', staffCount: 28, riskLevel: 'High', coverage: 85, status: 'Active' },
  { id: 'bu-2', code: 'BU-SETT-02', name: 'Settlements, Clearing & Money Market', head: 'Emeka Nwosu', staffCount: 18, riskLevel: 'High', coverage: 90, status: 'Active' },
  { id: 'bu-3', code: 'BU-CONT-03', name: 'Contribution Reconciliation & Invoicing', head: 'Amina Bello', staffCount: 22, riskLevel: 'High', coverage: 80, status: 'Active' },
  { id: 'bu-4', code: 'BU-ACCT-04', name: 'Fund Accounting & Net Asset Valuation (NAV)', head: 'Babatunde Adebayo', staffCount: 16, riskLevel: 'High', coverage: 95, status: 'Active' },
  { id: 'bu-5', code: 'BU-RISK-05', name: 'Risk Management & Compliance', head: 'Dr. Joseph Iheke', staffCount: 14, riskLevel: 'Medium', coverage: 100, status: 'Active' },
  { id: 'bu-6', code: 'BU-IT-06', name: 'Information Technology & Cybersecurity', head: 'Oluwaseun Thorne', staffCount: 25, riskLevel: 'High', coverage: 88, status: 'Active' },
  { id: 'bu-7', code: 'BU-AUD-07', name: 'Internal Audit & Assurance', head: 'Chief Audit Executive (CAE)', staffCount: 12, riskLevel: 'Low', coverage: 100, status: 'Active' },
  { id: 'bu-8', code: 'BU-LGL-08', name: 'Legal & Company Secretarial', head: 'Chioma Chukwu', staffCount: 8, riskLevel: 'Medium', coverage: 75, status: 'Active' },
  { id: 'bu-9', code: 'BU-HR-09', name: 'Human Resources & Administration', head: 'Folake Adeleke', staffCount: 15, riskLevel: 'Low', coverage: 70, status: 'Active' },
  { id: 'bu-10', code: 'BU-FIN-10', name: 'Finance & Corporate Planning', head: 'Ibrahim Danjuma', staffCount: 14, riskLevel: 'Medium', coverage: 85, status: 'Active' },
  { id: 'bu-11', code: 'BU-CRM-11', name: 'Client Relationship & Pension Services', head: 'Grace Okafor', staffCount: 20, riskLevel: 'Medium', coverage: 80, status: 'Active' },
  { id: 'bu-12', code: 'BU-EXEC-12', name: 'Executive Management & Governance', head: 'Managing Director / CEO', staffCount: 6, riskLevel: 'Medium', coverage: 100, status: 'Active' }
];

export const INITIAL_AUDIT_UNIVERSE = [];

export const INITIAL_ANNUAL_AUDIT_PLANS = [];

export const INITIAL_AUDIT_PROGRAMS = [];

export const INITIAL_WORKING_PAPERS = [];

export const INITIAL_FINDINGS = [];

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
