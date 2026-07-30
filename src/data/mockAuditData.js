// Master Structure & Institutional Roles Definitions for Zenith Pension Custodian (ZPC) Audit Management Application
// RiskINTEGRA Audit™ - Zero-Trust Institutional Ecosystem (Production Mode)

export const INITIAL_BUSINESS_UNITS = [
  { id: 'BU-001', name: 'Compliance and Risk Management', code: 'CRM', head: 'Chief Risk Officer', staffCount: 12, riskLevel: 'Critical', coveragePct: 100 },
  { id: 'BU-002', name: 'Internal Control and Audit', code: 'ICA', head: 'Chief Audit Executive', staffCount: 8, riskLevel: 'High', coveragePct: 100 },
  { id: 'BU-003', name: 'Custodial Operations', code: 'OPS', head: 'Head of Operations', staffCount: 45, riskLevel: 'Critical', coveragePct: 85 },
  { id: 'BU-004', name: 'Legal & Company Secretariat', code: 'LEG', head: 'Company Secretary', staffCount: 5, riskLevel: 'Medium', coveragePct: 90 },
  { id: 'BU-005', name: 'Human Resources', code: 'HRD', head: 'Head of HR', staffCount: 10, riskLevel: 'Medium', coveragePct: 75 },
  { id: 'BU-006', name: 'Information Technology', code: 'ITD', head: 'Head of IT', staffCount: 18, riskLevel: 'High', coveragePct: 80 },
  { id: 'BU-007', name: 'Client Services / Relationship Mgmt', code: 'CSM', head: 'Head of Client Services', staffCount: 20, riskLevel: 'Medium', coveragePct: 85 },
  { id: 'BU-008', name: 'Financial Control', code: 'FIN', head: 'Chief Financial Officer', staffCount: 15, riskLevel: 'High', coveragePct: 95 },
  { id: 'BU-009', name: 'Settlement & Reconciliation', code: 'SNR', head: 'Head of Settlements', staffCount: 25, riskLevel: 'Critical', coveragePct: 92 },
  { id: 'BU-010', name: 'Corporate Communications', code: 'CCD', head: 'Head of Corporate Comms', staffCount: 4, riskLevel: 'Low', coveragePct: 70 },
  { id: 'BU-011', name: 'Investment Administration', code: 'INV', head: 'Head of Investment Admin', staffCount: 14, riskLevel: 'High', coveragePct: 88 },
  { id: 'BU-012', name: 'Executive Management', code: 'EXM', head: 'Managing Director/CEO', staffCount: 6, riskLevel: 'Medium', coveragePct: 100 }
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
