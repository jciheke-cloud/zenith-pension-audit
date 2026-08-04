# RiskINTEGRA — Architecture & Documentation Standards

> **Living Document:** This standard defines the architecture, deployment protocol, and future development guidelines for both the ERM and Audit applications. It is designed to eliminate guesswork and prevent environmental corruption.

---

## 1. System Architecture

RiskINTEGRA is built as a decoupled, multi-tenant cloud application. 

### Frontend
- **Framework:** React.js powered by Vite.
- **State Management:** React Context API (`RiskContext.jsx` and `AuditContext.jsx`).
- **Styling:** Tailwind CSS with custom thematic configuration.
- **Hosting:** AWS S3 natively distributed via AWS CloudFront.
  - **ERM App:** Hosted at the root domain.
  - **Audit App:** Configured with a Vite base of `/audit-portal/` and hosted on a separate S3 bucket mapped via CloudFront.

### Backend
- **Compute:** Single AWS Lambda instance handling all REST requests (`app.js`).
- **API Gateway:** `https://uhzosq0g0i.execute-api.eu-west-1.amazonaws.com/prod`
- **Authentication:** AWS Cognito (handling RBAC, SSO, and token issuance).
- **Database:** PostgreSQL (accessed directly by Lambda).

---

## 2. Deployment Strategy (The "Code Vault" Model)

To eliminate the risk of automated pipelines overwriting the live environment with broken code, **GitHub CI/CD pipelines are strictly disabled**. GitHub acts exclusively as a secure backup ("Code Vault"). 

All deployments to AWS are performed manually by an authorized developer or agent following these steps:

### Deploying the ERM App
```bash
# 1. Navigate to the ERM directory
cd zenith_pensions_erm

# 2. Build the production assets
npm run build

# 3. Sync directly to the ERM S3 Bucket
aws s3 sync dist s3://riskintegra-erm-frontend-frontendbucket-xz3sjsennvjl --delete
```

### Deploying the Audit App
> [!IMPORTANT]
> The Audit app MUST be synced into the `audit-portal/` subdirectory on the S3 bucket to ensure CloudFront routing works correctly.

```bash
# 1. Navigate to the Audit directory
cd zenith_pensions_audit

# 2. Build the production assets
npm run build

# 3. Sync to the 'audit-portal' subfolder on the Audit S3 Bucket
aws s3 sync dist s3://riskintegra-erm-frontend-auditfrontendbucket-6j5mxckl17zv/audit-portal --delete
```

---

## 3. Data Persistence Rules (No LocalStorage)

> [!WARNING]
> Due to strict multi-user compliance and data consistency requirements, `localStorage` is completely banned for storing business data (Risks, Controls, Business Units, Findings, etc.).

1. **Session Storage Only:** Only use `sessionStorage` for temporary, non-sensitive UI state (e.g., active tabs, dark mode) or the encrypted AWS Cognito Auth Token. `sessionStorage` ensures data is wiped when the browser tab closes.
2. **Context API as Source of Truth:** All data must be fetched from the AWS backend upon initial load and stored in memory using the Context API (`RiskContext` or `AuditContext`). 
3. **Write Operations:** Any mutation (Create, Update, Delete) must first send a successful `POST/PUT/DELETE` to the AWS Lambda backend *before* the local Context state is updated to reflect the change. Optimistic UI updates without verified backend persistence are prohibited.

---

## 4. API Routing Map

| Application | Domain / Module | Backend Route Prefix |
|-------------|-----------------|----------------------|
| **ERM** | Risk Register | `/api/risks` |
| **ERM** | Internal Controls | `/api/controls` |
| **ERM** | Loss Event Ledger | `/api/losses` |
| **ERM** | Action Tracker (CAP) | `/api/actions` |
| **ERM** | KRI Metrics | `/api/metrics` |
| **Audit** | Audit Universe / BU | `/api/audit/universe` |
| **Audit** | Annual Plans | `/api/audit/plans` |
| **Audit** | Findings | `/api/audit/findings` |
| **Audit** | Working Papers | `/api/audit/working-papers` |
| **Shared** | User Management | `/api/users` |

---

## 5. Future Enhancements Roadmap

The following technical debts and functional enhancements have been identified for upcoming development cycles:

### A. Direct Backend Bulk Ingestion
Currently, the `DataUpload` (ERM) and `AuditDataUpload` (Audit) components attempt a complex 3-phase S3 upload process using a pre-signed URL endpoint (`GET /api/upload/signed-url`) which does not exist on the backend. 
- **Solution:** Refactor both upload components to bypass S3 entirely. They should parse the Excel/CSV client-side and push the raw JSON directly to the backend bulk endpoints (e.g., `POST /api/risks/bulk`). 

### B. Predictive EWS Forecasting (PencomCapitalEngine)
The "Run Predictive EWS Forecast" logic inside `PencomCapitalEngine.jsx` attempts to call a non-existent `/api/ews/forecast` endpoint.
- **Solution:** Either implement a lightweight forecasting algorithm directly inside the frontend Context, or build out the corresponding Lambda endpoint to return deterministic forecast arrays.

### C. PDF Report Generation
In `ReportsAndCommittee.jsx` (Audit App) and `ExecutiveDashboard.jsx` (ERM App), the "Generate Board Report" buttons currently simulate a delay and trigger a toast notification without producing a physical file.
- **Solution:** Integrate `jsPDF` and `html2canvas` to render the DOM elements into a downloadable PDF binary.

### D. Vendor Risk Migration
`VendorRisk.jsx` (ERM App) still contains legacy traces of `localStorage` logic that were not fully captured during the global purge. 
- **Solution:** Fully wire the Vendor Risk UI to the existing, verified `/api/vendors` backend route.
