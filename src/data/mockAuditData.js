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

export const INITIAL_ANNUAL_AUDIT_PLANS = [];

export const INITIAL_AUDIT_PROGRAMS = [];

export const INITIAL_WORKING_PAPERS = [];

export const INITIAL_FINDINGS = [];

export const INITIAL_INTERNAL_CONTROLS = [];

export const INITIAL_REGULATORY_REVIEWS = [];

export const INITIAL_FRAUD_CASES = [];

export const INITIAL_CONTINUOUS_EXCEPTIONS = [];

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
