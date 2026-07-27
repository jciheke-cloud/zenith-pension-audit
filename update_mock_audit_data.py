import os

filepath = r"C:\Users\jcihe\.gemini\antigravity\scratch\zenith_pensions_audit\src\data\mockAuditData.js"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add a new audit plan for PFA Fee Reconciliation
if "'PLAN-2026-02'" not in content:
    content = content.replace("export const INITIAL_ANNUAL_AUDIT_PLANS = [", 
        "export const INITIAL_ANNUAL_AUDIT_PLANS = [\n  {\n    id: 'plan-2',\n    planId: 'PLAN-2026-02',\n    auditName: 'Q4 PFA Fee Reconciliation & Billing Audit',\n    department: 'Contribution Reconciliation & Invoicing',\n    plannedHours: 200,\n    actualHours: 0,\n    status: 'Draft',\n    startDate: '2026-10-01',\n    endDate: '2026-12-15',\n    leadAuditor: 'Lead Financial Auditor'\n  },")

# Add a new working paper
if "'WP-102'" not in content:
    content = content.replace("export const INITIAL_WORKING_PAPERS = [", 
        "export const INITIAL_WORKING_PAPERS = [\n  {\n    id: 'WP-102',\n    title: 'PFA Instruction Accuracy & Defect Rate Testing',\n    fileName: 'pfa_instruction_defects_q3.xlsx',\n    fileType: 'Excel Workbook (.xlsx)',\n    linkedAudit: 'Q4 PFA Fee Reconciliation & Billing Audit',\n    uploadedBy: 'Lead Financial Auditor',\n    samplingMethod: 'Systematic Interval',\n    populationSize: '15,000',\n    sampleSize: '250',\n    checksum: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',\n    status: 'Submitted for Review'\n  },")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated mockAuditData.js successfully.")
