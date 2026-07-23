// Master Structure & Institutional Roles Definitions for Zenith Pension Custodian (ZPC) Audit Management Application
// RiskINTEGRA Audit™ - Zero-Trust Institutional Ecosystem (No Mock Data)

export const INITIAL_BUSINESS_UNITS = [];

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
