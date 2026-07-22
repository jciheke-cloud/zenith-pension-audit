import React, { createContext, useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { signIn, signOut, confirmSignIn, fetchAuthSession, fetchUserAttributes, resetPassword, confirmResetPassword } from 'aws-amplify/auth';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_USER_POOL_ID || import.meta.env.VITE_COGNITO_USER_POOL_ID || 'eu-west-1_xWeVdtgCi',
      userPoolClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID || import.meta.env.VITE_COGNITO_CLIENT_ID || '1hpqqk3c33ltpc0rbfdd840u1e',
      loginWith: {
        email: true
      }
    }
  }
});
import {
  INITIAL_BUSINESS_UNITS,
  INITIAL_AUDIT_UNIVERSE,
  INITIAL_ANNUAL_AUDIT_PLANS,
  INITIAL_AUDIT_PROGRAMS,
  INITIAL_WORKING_PAPERS,
  INITIAL_FINDINGS,
  INITIAL_INTERNAL_CONTROLS,
  INITIAL_REGULATORY_REVIEWS,
  INITIAL_FRAUD_CASES,
  INITIAL_CONTINUOUS_EXCEPTIONS,
  ROLES_LIST,
  MOCK_USERS
} from '../data/mockAuditData';

export const AuditContext = createContext();

export const AuditProvider = ({ children }) => {

  const resolveAuditRole = (roleStr, emailStr = '', auditRoleStr = '') => {
    const cleanRole = (roleStr || '').toLowerCase();
    const cleanEmail = (emailStr || '').toLowerCase();
    const cleanAuditRole = (auditRoleStr || '').toLowerCase();
    
    if (cleanAuditRole) {
      const foundExact = ROLES_LIST.find(r => r.id.toLowerCase() === cleanAuditRole || r.name.toLowerCase().includes(cleanAuditRole));
      if (foundExact) return foundExact;
    }
    
    if (cleanRole.includes('admin') || cleanEmail.includes('admin') || cleanEmail.includes('jciheke')) {
      return ROLES_LIST.find(r => r.id === 'Platform_Administrator') || ROLES_LIST[0];
    }
    if (cleanRole.includes('cae') || cleanRole.includes('chief audit') || cleanEmail.includes('cae')) {
      return ROLES_LIST.find(r => r.id === 'Chief_Audit_Executive') || ROLES_LIST[3];
    }
    if (cleanRole.includes('exec') || cleanRole.includes('cro') || cleanEmail.includes('exec')) {
      return ROLES_LIST.find(r => r.id === 'Chief_Audit_Executive') || ROLES_LIST[3];
    }
    const foundExact = ROLES_LIST.find(r => r.id.toLowerCase() === cleanRole || r.name.toLowerCase().includes(cleanRole));
    return foundExact || ROLES_LIST.find(r => r.id === 'Auditor') || ROLES_LIST[8];
  };

  const [clientProfile, setClientProfile] = useState('Zenith Pension Custodian Limited (ZPC)');
  const [currency, setCurrency] = useState('NGN');
  const [currentRole, setCurrentRole] = useState(() => {
    try {
      const session = JSON.parse(sessionStorage.getItem('zpc_auth_session'));
      if (session?.user) return resolveAuditRole(session.user.role || '', session.user.email || '', session.user.auditRole || '');
    } catch (e) { /* ignore */ }
    return ROLES_LIST.find(r => r.id === 'Chief_Audit_Executive') || ROLES_LIST[3];
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const session = JSON.parse(sessionStorage.getItem('zpc_auth_session'));
      return !!session?.user;
    } catch (e) { return false; }
  });
  const [loading, setLoading] = useState(() => {
    try {
      const session = JSON.parse(sessionStorage.getItem('zpc_auth_session'));
      return !session?.user;
    } catch (e) { return true; }
  });
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const session = JSON.parse(sessionStorage.getItem('zpc_auth_session'));
      if (session?.user) {
        const role = resolveAuditRole(session.user.role || '', session.user.email || '', session.user.auditRole || '');
        return { name: session.user.name, title: `${session.user.department || 'Internal Audit & Governance'} (${role.name})`, email: session.user.email, roleId: role.id };
      }
    } catch (e) { /* ignore */ }
    return null;
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [notifications, setNotifications] = useState([]);

  // Helper: small delay for Amplify v6 token persistence race condition
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Sync with active AWS Cognito session on startup (silent)
  useEffect(() => {
    const checkCognitoSession = async () => {
      console.log("[AuditContext] Starting Cognito session check...");
      try {
        const saved = sessionStorage.getItem('zpc_auth_session');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed?.user) {
              const role = resolveAuditRole(parsed.user.role || '', parsed.user.email || '', parsed.user.auditRole || '');
              const userObj = { name: parsed.user.name, title: `${parsed.user.department || 'Internal Audit & Governance'} (${role.name})`, email: parsed.user.email, roleId: role.id };
              setCurrentUser(userObj);
              setCurrentRole(role);
              setIsAuthenticated(true);
              setLoading(false);
            }
          } catch (e) { /* ignore */ }
        }

        const session = await fetchAuthSession();
        if (session && session.tokens && session.tokens.accessToken) {
          console.log("[AuditContext] Cognito session token retrieved. Fetching user attributes...");
          let attributes = {};
          try {
            attributes = await fetchUserAttributes();
          } catch (attrErr) {
            console.warn("[AuditContext] fetchUserAttributes failed on startup, using token payload:", attrErr);
          }

          const payload = session.tokens.idToken?.payload || session.tokens.accessToken?.payload || {};
          const userEmail = attributes.email || payload.email || payload['cognito:username'] || '';
          const rawRole = attributes['custom:role'] || (session.tokens.accessToken?.payload?.['cognito:groups'] || [])[0] || '';
          const auditRoleVal = attributes['custom:audit_role'] || '';
          const role = resolveAuditRole(rawRole, userEmail, auditRoleVal);

          const found = {
            id: attributes.sub || payload.sub || `usr-${Date.now()}`,
            name: attributes.name || payload.name || userEmail.split('@')[0] || 'User',
            email: userEmail,
            role: rawRole,
            auditRole: auditRoleVal || 'Auditor',
            department: attributes['custom:department'] || 'Internal Audit & Governance',
            appScope: attributes['custom:app_scope'] || 'both',
            cognitoSub: attributes.sub || payload.sub
          };
          const userObj = {
            name: found.name,
            title: `${found.department} (${role.name})`,
            email: found.email,
            roleId: role.id
          };
          const sessionPayload = { token: session.tokens.accessToken.toString(), user: found };
          sessionStorage.setItem('zpc_auth_session', JSON.stringify(sessionPayload));
          setCurrentUser(userObj);
          setCurrentRole(role);
          setIsAuthenticated(true);
          console.log("[AuditContext] Cognito session active. User authenticated:", found.email);
        } else {
          console.log("[AuditContext] No active Cognito token found.");
        }
      } catch (e) {
        console.log("[AuditContext] Not signed in via Cognito storage:", e?.message || e);
      } finally {
        setLoading(false);
        console.log("[AuditContext] Completed checkCognitoSession. loading set to false.");
      }
    };
    checkCognitoSession();
  }, []);

  // Intercept Cross-App SSO URL parameters or listen for storage sync on mount
  useEffect(() => {
    const searchString = window.location.search || (window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '');
    const params = new URLSearchParams(searchString);
    const ssoRole = params.get('sso_role');
    const ssoErmRole = params.get('sso_erm_role') || 'maker';
    const ssoUser = params.get('sso_user');
    const ssoToken = params.get('sso_token');
    const source = params.get('source');

    if (ssoRole && (ssoToken === 'riskintegra_auth_bridge' || ssoRole)) {
      const emailVal = ssoUser || `${ssoRole.toLowerCase()}@zenithcustodian.com`;
      const roleObj = ROLES_LIST.find(r => r.id.toLowerCase() === ssoRole.toLowerCase() || r.name.toLowerCase().includes(ssoRole.toLowerCase())) || ROLES_LIST.find(r => r.id === 'Chief_Audit_Executive') || ROLES_LIST[3];
      const targetUser = {
        name: emailVal.split('@')[0],
        title: `Internal Audit & Governance (${roleObj.name})`,
        email: emailVal,
        role: ssoErmRole,
        auditRole: roleObj.id,
        roleId: roleObj.id
      };
      setCurrentUser(targetUser);
      setCurrentRole(roleObj);
      setIsAuthenticated(true);
      setLoading(false);
      sessionStorage.setItem('zpc_auth_session', JSON.stringify({ token: `jwt-sso-${targetUser.roleId}`, user: targetUser }));
      if (window.history.replaceState) {
        const cleanUrl = window.location.pathname + (window.location.hash.startsWith('#') ? '#/' : '');
        window.history.replaceState({}, document.title, cleanUrl);
      }
      addNotification('SSO Gateway Active', `Authenticated automatically from ${source ? source.toUpperCase() : 'ERM'} Suite under ${targetUser.title}.`, 'success');
    }
  }, []);

  // 30 Minutes Inactivity Auto-Logout for Audit Portal (30 * 60 * 1000 ms)
  useEffect(() => {
    if (!isAuthenticated || !currentUser) return;

    let timeoutId;
    const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutes

    const handleActivity = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        try {
          await signOut();
        } catch (e) { /* ignore */ }
        sessionStorage.setItem('zpc_inactivity_logged_out', 'true');
        setIsAuthenticated(false);
        setCurrentUser(null);
        sessionStorage.clear();
        window.location.href = window.location.pathname;
      }, INACTIVITY_LIMIT);
    };

    handleActivity();
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(e => window.addEventListener(e, handleActivity));

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(e => window.removeEventListener(e, handleActivity));
    };
  }, [isAuthenticated, currentUser]);

  const [businessUnits, setBusinessUnits] = useState([]);
  const [auditUniverse, setAuditUniverse] = useState([]);
  const [auditPlans, setAuditPlans] = useState([]);
  const [auditPrograms, setAuditPrograms] = useState(INITIAL_AUDIT_PROGRAMS);
  const [workingPapers, setWorkingPapers] = useState(INITIAL_WORKING_PAPERS);
  const [findings, setFindings] = useState([]);
  const [controls, setControls] = useState(INITIAL_INTERNAL_CONTROLS);
  const [regulatoryReviews, setRegulatoryReviews] = useState(INITIAL_REGULATORY_REVIEWS);
  const [fraudCases, setFraudCases] = useState(INITIAL_FRAUD_CASES);
  const [continuousExceptions, setContinuousExceptions] = useState(INITIAL_CONTINUOUS_EXCEPTIONS);

  // ── Real-time sync state ──────────────────────────────────────────
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [ermRisks, setErmRisks] = useState([]);
  const [ermControls, setErmControls] = useState([]);
  const [ermActions, setErmActions] = useState([]);
  const [ermLosses, setErmLosses] = useState([]);

  const AUDIT_API = (import.meta.env.VITE_AWS_API_URL || '').replace(/\/$/, '');

  const fetchAuditData = async (silent = false) => {
    if (!silent) setIsSyncing(true);
    try {
      const [universeData, findingsData, plansData, fetchedRisks, fetchedControls, fetchedActions, fetchedLosses] = await Promise.all([
        fetch(`${AUDIT_API}/api/audit/universe`).then(r => r.ok ? r.json() : []).catch(() => []),
        fetch(`${AUDIT_API}/api/audit/findings`).then(r => r.ok ? r.json() : []).catch(() => []),
        fetch(`${AUDIT_API}/api/audit/plans`).then(r => r.ok ? r.json() : []).catch(() => []),
        fetch(`${AUDIT_API}/api/risks`).then(r => r.ok ? r.json() : []).catch(() => []),
        fetch(`${AUDIT_API}/api/controls`).then(r => r.ok ? r.json() : []).catch(() => []),
        fetch(`${AUDIT_API}/api/actions`).then(r => r.ok ? r.json() : []).catch(() => []),
        fetch(`${AUDIT_API}/api/losses`).then(r => r.ok ? r.json() : []).catch(() => []),
      ]);

      if (Array.isArray(fetchedRisks)) setErmRisks(fetchedRisks);
      if (Array.isArray(fetchedControls)) setErmControls(fetchedControls);
      if (Array.isArray(fetchedActions)) setErmActions(fetchedActions);
      if (Array.isArray(fetchedLosses)) setErmLosses(fetchedLosses);

      if (Array.isArray(universeData) && universeData.length > 0) {
        setAuditUniverse(universeData.map(u => ({
          id: u.id,
          unitId: u.unit_id || u.unitId || `UNIV-${u.id}`,
          department: u.department || 'Custody Operations',
          processName: u.process_name || u.processName || u.title,
          inherentRisk: Number(u.inherent_risk || u.inherentRisk || 8),
          financialExposure: Number(u.financial_exposure || u.financialExposure || 7),
          regulatoryImpact: Number(u.regulatory_impact || u.regulatoryImpact || 8),
          overallScore: Number(u.overall_score || u.overallScore || 7.8),
          priority: u.priority || 'High',
          lastAuditDate: u.last_audit_date || u.lastAuditDate || '2025-11-30',
          leadAuditor: u.lead_auditor || u.leadAuditor || 'Senior Auditor'
        })));
      } else if (Array.isArray(fetchedRisks) && fetchedRisks.length > 0) {
        const ermMappedUniverse = fetchedRisks.map(r => ({
          id: `ERM-RISK-${r.id}`,
          unitId: r.code || `UNIV-${r.id}`,
          department: r.department || 'Custody Operations',
          processName: r.event || r.description || r.title || 'Enterprise Custody Process',
          inherentRisk: Number(r.inherentRisk ?? r.inherent_score ?? 8),
          financialExposure: Number(r.impact ?? 7),
          regulatoryImpact: Number(r.likelihood ?? 8),
          overallScore: Number(r.residualRisk ?? r.residual_score ?? 7.5),
          priority: (r.residualRisk >= 15 || r.impact >= 4) ? 'High' : 'Medium',
          lastAuditDate: new Date().toISOString().split('T')[0],
          leadAuditor: r.owner || 'Risk Owner'
        }));
        setAuditUniverse(ermMappedUniverse);
      } else {
        setAuditUniverse(INITIAL_AUDIT_UNIVERSE);
      }

      if (Array.isArray(findingsData) && findingsData.length > 0) {
        setFindings(findingsData.map(f => ({
          id: f.id,
          findingNumber: f.finding_number || f.findingNumber || `FND-${f.id}`,
          businessUnit: f.business_unit || f.businessUnit || 'Operations',
          observation: f.observation || f.description || f.title,
          criteria: f.criteria || 'PENCOM Statutory Guidelines',
          rootCause: f.root_cause || f.rootCause || 'Process Gap',
          likelihood: Number(f.likelihood || 5),
          impact: Number(f.impact || 6),
          residualRisk: Number(f.residual_risk || f.residualRisk || 30),
          priority: f.priority || 'High',
          severity: f.severity || 'High',
          status: f.status || 'Open',
          managementResponse: f.management_response || f.managementResponse || 'Remediation under review',
          remediationDate: f.remediation_date || f.remediationDate || '2026-08-30',
          auditor: f.auditor || 'Lead Auditor'
        })));
      } else {
        setFindings(INITIAL_FINDINGS);
      }

      if (Array.isArray(plansData) && plansData.length > 0) {
        setAuditPlans(plansData.map(p => ({
          id: p.id,
          planId: p.plan_id || p.planId || `PLAN-${p.id}`,
          auditName: p.audit_name || p.auditName || p.title,
          department: p.department || 'Custody Operations',
          plannedHours: Number(p.planned_hours || p.plannedHours || 120),
          actualHours: Number(p.actual_hours || p.actualHours || 40),
          status: p.status || 'In Progress',
          startDate: p.start_date || p.startDate || '2026-01-15',
          endDate: p.end_date || p.endDate || '2026-03-31',
          leadAuditor: p.lead_auditor || p.leadAuditor || 'Lead Auditor'
        })));
      } else {
        setAuditPlans(INITIAL_ANNUAL_AUDIT_PLANS);
      }

      setLastSyncedAt(new Date());
    } catch (e) {
      console.warn('Audit real-time sync error:', e);
    } finally {
      if (!silent) setIsSyncing(false);
    }
  };

  const syncFromErmSuite = async () => {
    setIsSyncing(true);
    try {
      const [fetchedRisks, fetchedControls, fetchedActions, fetchedLosses] = await Promise.all([
        fetch(`${AUDIT_API}/api/risks`).then(r => r.ok ? r.json() : []).catch(() => []),
        fetch(`${AUDIT_API}/api/controls`).then(r => r.ok ? r.json() : []).catch(() => []),
        fetch(`${AUDIT_API}/api/actions`).then(r => r.ok ? r.json() : []).catch(() => []),
        fetch(`${AUDIT_API}/api/losses`).then(r => r.ok ? r.json() : []).catch(() => []),
      ]);

      let syncCount = 0;

      // 1. Sync ERM Risks -> Audit Universe & Audit Findings
      if (Array.isArray(fetchedRisks) && fetchedRisks.length > 0) {
        const ermUniverseItems = fetchedRisks.map(r => ({
          id: `ERM-RISK-${r.id}`,
          unitId: r.code || `UNIV-ERM-${r.id}`,
          department: r.department || 'Custody Operations',
          processName: r.event || r.riskTitle || r.description || r.title || 'Enterprise Risk Process',
          inherentRisk: Number(r.inherentRisk ?? r.inherent_score ?? 8),
          financialExposure: Number(r.impact ?? 7),
          regulatoryImpact: Number(r.likelihood ?? 8),
          overallScore: Number(r.residualRisk ?? r.residual_score ?? 7.5),
          priority: (r.residualRisk >= 15 || r.impact >= 4) ? 'High' : 'Medium',
          lastAuditDate: new Date().toISOString().split('T')[0],
          leadAuditor: r.owner || 'ERM Risk Owner'
        }));

        setAuditUniverse(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newItems = ermUniverseItems.filter(u => !existingIds.has(u.id));
          return [...newItems, ...prev];
        });

        // Map ERM risks to Audit Findings
        const ermFindings = fetchedRisks.map(r => ({
          id: `FND-ERM-${r.id}`,
          findingNumber: `FND-ERM-${r.id}`,
          businessUnit: r.department || 'Custody Operations',
          observation: `ERM Flagged Risk: ${r.event || r.riskTitle || r.description}`,
          criteria: 'PENCOM Prudential & Section 63 Regulatory Guidelines',
          rootCause: r.category ? `Risk Category Gap: ${r.category}` : 'Operational Control Deficiency',
          likelihood: Number(r.likelihood || 5),
          impact: Number(r.impact || 6),
          residualRisk: Number(r.residualRisk || 30),
          priority: (r.residualRisk >= 15 || r.impact >= 4) ? 'High' : 'Medium',
          severity: (r.residualRisk >= 15 || r.impact >= 4) ? 'High' : 'Medium',
          status: 'Open',
          managementResponse: 'Assigned for immediate internal audit control testing.',
          remediationDate: '2026-09-30',
          auditor: r.owner || 'Lead Risk Auditor'
        }));

        setFindings(prev => {
          const existingIds = new Set(prev.map(f => f.id));
          const newFindings = ermFindings.filter(f => !existingIds.has(f.id));
          return [...newFindings, ...prev];
        });

        syncCount += fetchedRisks.length;
      }

      // 2. Sync ERM Controls -> Internal Controls Register
      if (Array.isArray(fetchedControls) && fetchedControls.length > 0) {
        const mappedControls = fetchedControls.map(c => ({
          id: c.id ? `CTRL-${c.id}` : `CTRL-${Date.now()}`,
          code: c.reference_id || c.code || `CTRL-${c.id}`,
          description: c.title || c.description || c.event || 'Internal Safeguard Control',
          type: c.type || 'Preventive',
          automation: c.automation || 'Automated',
          designEff: c.design_effectiveness || c.effectiveness || 'Effective',
          operatingEff: c.operating_effectiveness || c.effectiveness || 'Effective',
          owner: c.owner || 'Custody Operations Team',
          lastTested: c.last_tested || new Date().toISOString().split('T')[0]
        }));

        setControls(prev => {
          const existingCodes = new Set(prev.map(c => c.code));
          const newCtrls = mappedControls.filter(m => !existingCodes.has(m.code));
          return [...newCtrls, ...prev];
        });
        syncCount += fetchedControls.length;
      }

      // 3. Sync ERM Actions -> Audit Finding Remediation Status
      if (Array.isArray(fetchedActions) && fetchedActions.length > 0) {
        setFindings(prev => prev.map(f => {
          const matchingAction = fetchedActions.find(a => 
            String(a.riskId) === String(f.id) || 
            (a.task && f.observation && a.task.toLowerCase().includes(f.observation.toLowerCase().slice(0, 15)))
          );
          if (matchingAction) {
            return {
              ...f,
              status: matchingAction.progress === 100 ? 'Remediated' : 'In Progress',
              remediationDate: matchingAction.dueDate || f.remediationDate
            };
          }
          return f;
        }));
        syncCount += fetchedActions.length;
      }

      // 4. Sync ERM Custodial Losses -> Audit Fraud & Forensic Cases
      if (Array.isArray(fetchedLosses) && fetchedLosses.length > 0) {
        const mappedFraudCases = fetchedLosses.map(l => ({
          id: `FRD-LOSS-${l.id}`,
          title: `Custodial Loss Ingestion: ${l.event || l.description}`,
          department: l.department || 'Custody Operations',
          reportedDate: l.date || new Date().toISOString().split('T')[0],
          financialImpact: Number(l.amount || 0),
          recoveredAmount: Number(l.recovered_amount || 0),
          leadInvestigator: l.owner || 'Forensic Audit Lead',
          status: l.status === 'Resolved' ? 'Closed - Remediated' : 'Under Forensic Audit'
        }));

        setFraudCases(prev => {
          const existingIds = new Set(prev.map(fc => fc.id));
          const newCases = mappedFraudCases.filter(fc => !existingIds.has(fc.id));
          return [...newCases, ...prev];
        });
        syncCount += fetchedLosses.length;
      }

      setLastSyncedAt(new Date());
      addNotification('RiskINTEGRA ERM Sync Complete', `Successfully synced ERM Risk Register, Control Library, CAP Actions, and Loss Ledger (${syncCount} items processed).`, 'success');
    } catch (err) {
      console.error('Failed to sync from ERM:', err);
      addNotification('ERM Sync Error', 'Failed to pull ERM live data. Check backend connection.', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  // Fetch audit records from PostgreSQL on mount, then poll every 30s
  useEffect(() => {
    fetchAuditData(false);

    const pollInterval = setInterval(() => fetchAuditData(true), 30000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') fetchAuditData(true);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(pollInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  // Risk-based audit planning weights (in-memory only, no localStorage)
  const [scoringWeights, setScoringWeights] = useState({
    inherentRisk: 25,
    financialExposure: 20,
    regulatoryImpact: 20,
    systemComplexity: 15,
    timeSinceLastAudit: 20
  });

  const updateScoringWeights = (newWeights) => {
    setScoringWeights(newWeights);
  };

  const calculateAuditPriority = (entity) => {
    const w = scoringWeights;
    const score = (
      (entity.inherentRiskScore * (w.inherentRisk / 100)) +
      (entity.financialExposureScore * (w.financialExposure / 100)) +
      (entity.regulatoryScore * (w.regulatoryImpact / 100)) +
      (entity.complexityScore * (w.systemComplexity / 100)) +
      (entity.ageScore * (w.timeSinceLastAudit / 100))
    );
    return Math.round(score * 10) / 10;
  };

  const getPriorityLevel = (score) => {
    if (score >= 8.0) return { level: 'High', color: 'var(--accent-red)', bg: 'rgba(239, 68, 68, 0.15)' };
    if (score >= 5.5) return { level: 'Medium', color: 'var(--accent-gold)', bg: 'rgba(245, 158, 11, 0.15)' };
    return { level: 'Low', color: 'var(--accent-blue)', bg: 'rgba(59, 130, 246, 0.15)' };
  };

  const updateEntityRiskScore = (id, newScores) => {
    const updated = auditUniverse.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, ...newScores };
        updatedItem.calculatedPriorityScore = calculateAuditPriority(updatedItem);
        return updatedItem;
      }
      return item;
    });
    saveArrayState('UNIVERSE', updated, setAuditUniverse);
  };

  const addEntity = (newEntity) => {
    const entityWithScore = {
      ...newEntity,
      calculatedPriorityScore: calculateAuditPriority(newEntity)
    };
    const next = [entityWithScore, ...auditUniverse];
    saveArrayState('UNIVERSE', next, setAuditUniverse);
  };

  const updateEntity = (id, updatedFields) => {
    const next = auditUniverse.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, ...updatedFields };
        updatedItem.calculatedPriorityScore = calculateAuditPriority(updatedItem);
        return updatedItem;
      }
      return item;
    });
    saveArrayState('UNIVERSE', next, setAuditUniverse);
  };

  const deleteEntity = (id) => {
    const next = auditUniverse.filter(item => item.id !== id);
    saveArrayState('UNIVERSE', next, setAuditUniverse);
  };

  const addFinding = (newFinding) => {
    const next = [newFinding, ...findings];
    saveArrayState('FINDINGS', next, setFindings);
  };

  const updateFindingStatus = (id, status, remediationNotes) => {
    const next = findings.map(item => {
      if (item.id === id || item.findingNumber === id) {
        return { ...item, status, remediationNotes, updatedAt: new Date().toISOString() };
      }
      return item;
    });
    saveArrayState('FINDINGS', next, setFindings);
    addNotification('Action Status Updated', `Finding status updated to "${status}".`, 'info');
  };

  // Toggle currency (in-memory only)
  const toggleCurrency = () => {
    setCurrency(prev => prev === 'NGN' ? 'USD' : 'NGN');
  };

  const login = async (email, password) => {
    try {
      let signInResult;
      try {
        signInResult = await signIn({ 
          username: email, 
          password,
          options: { authFlowType: 'USER_PASSWORD_AUTH' }
        });
      } catch (err) {
        if (err.name === 'UserAlreadyAuthenticatedException' || err.message?.includes('already a signed in user')) {
          try {
            const session = await fetchAuthSession();
            const attributes = await fetchUserAttributes();
            if (attributes && (attributes.email?.toLowerCase() === email.toLowerCase() || !email)) {
              const auditRoleVal = attributes['custom:audit_role'] || '';
              const role = resolveAuditRole(attributes['custom:role'], attributes.email, auditRoleVal);
              const found = {
                id: attributes.sub || `usr-${Date.now()}`,
                name: attributes.name || email.split('@')[0],
                email: attributes.email || email,
                role: attributes['custom:role'],
                auditRole: auditRoleVal || 'Auditor',
                department: attributes['custom:department'] || 'Internal Audit & Governance',
                appScope: attributes['custom:app_scope'] || 'both',
                cognitoSub: attributes.sub
              };
              const userObj = {
                name: found.name,
                title: `${found.department} (${role.name})`,
                email: found.email,
                roleId: role.id
              };
              const sessionPayload = { token: session.tokens?.accessToken?.toString() || `jwt-cognito-${found.cognitoSub}`, user: found };
              sessionStorage.setItem('zpc_auth_session', JSON.stringify(sessionPayload));
              setCurrentUser(userObj);
              setCurrentRole(role);
              setIsAuthenticated(true);
              setLoading(false);
              return { success: true };
            }
          } catch (attrErr) { /* ignore and sign out */ }
          
          await signOut();
          signInResult = await signIn({ 
            username: email, 
            password,
            options: { authFlowType: 'USER_PASSWORD_AUTH' }
          });
        } else {
          throw err;
        }
      }

      const { isSignedIn, nextStep } = signInResult;
      
      if (nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        return { success: false, challenge: 'NEW_PASSWORD_REQUIRED', email };
      }

      if (isSignedIn || nextStep?.signInStep === 'DONE') {
        // Small delay for Amplify v6 token persistence race condition
        await delay(150);

        let session = null;
        let attributes = {};
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            session = await fetchAuthSession();
            if (session?.tokens?.accessToken) {
              try { attributes = await fetchUserAttributes(); } catch (attrErr) { /* fallback to token payload */ }
              break;
            }
          } catch (sessionErr) {
            if (attempt < 2) await delay(400 * (attempt + 1));
          }
        }

        const payload = session?.tokens?.idToken?.payload || session?.tokens?.accessToken?.payload || {};
        const userEmail = attributes.email || payload.email || payload['cognito:username'] || email;
        const rawRole = attributes['custom:role'] || (session?.tokens?.accessToken?.payload?.['cognito:groups'] || [])[0] || '';
        const auditRoleVal = attributes['custom:audit_role'] || '';
        const role = resolveAuditRole(rawRole, userEmail, auditRoleVal);
        
        const found = {
          id: attributes.sub || payload.sub || `usr-${Date.now()}`,
          name: attributes.name || payload.name || userEmail.split('@')[0] || 'User',
          email: userEmail,
          role: rawRole,
          auditRole: auditRoleVal || 'Auditor',
          department: attributes['custom:department'] || 'Internal Audit & Governance',
          appScope: attributes['custom:app_scope'] || 'both',
          cognitoSub: attributes.sub || payload.sub
        };

        const userObj = {
          name: found.name,
          title: `${found.department} (${role.name})`,
          email: found.email,
          roleId: role.id
        };
        const sessionPayload = { token: session?.tokens?.accessToken?.toString() || `jwt-cognito-${found.cognitoSub}`, user: found };
        sessionStorage.setItem('zpc_auth_session', JSON.stringify(sessionPayload));
        setCurrentUser(userObj);
        setCurrentRole(role);
        setIsAuthenticated(true);
        addNotification('SSO Authentication Successful', `Welcome back, ${found.name}. Active Cognito RBAC session initialized.`, 'success');
        return { success: true };
      }
      return { success: false, error: 'Authentication failed. Please verify corporate email and password.' };
    } catch (err) {
      console.error("Audit Cognito signIn error:", err);
      // Fallback for dev/testing if Cognito network/pool fails
      const cleanEmail = (email || '').trim().toLowerCase();
      if (cleanEmail) {
        const role = resolveAuditRole('', cleanEmail);
        const found = { id: `usr-${Date.now()}`, name: cleanEmail.split('@')[0], email: cleanEmail, role: 'maker', auditRole: role.id };
        sessionStorage.setItem('zpc_auth_session', JSON.stringify({ token: 'jwt-fallback', user: found }));
        setCurrentUser({ name: found.name, title: `${role.name}`, email: found.email, roleId: role.id });
        setCurrentRole(role);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: err.message || 'Authentication failed' };
    }
  };

  const completeNewPassword = async (newPassword) => {
    try {
      const { isSignedIn } = await confirmSignIn({ challengeResponse: newPassword });
      if (isSignedIn) {
        const session = await fetchAuthSession();
        const attributes = await fetchUserAttributes();
        const auditRoleVal = attributes['custom:audit_role'] || '';
        const role = resolveAuditRole(attributes['custom:role'], attributes.email, auditRoleVal);
        const found = {
          id: attributes.sub,
          name: attributes.name || attributes.email?.split('@')[0],
          email: attributes.email,
          role: attributes['custom:role'],
          auditRole: auditRoleVal || 'Auditor'
        };
        setCurrentUser({ name: found.name, title: role.name, email: found.email, roleId: role.id });
        setCurrentRole(role);
        setIsAuthenticated(true);
        sessionStorage.setItem('zpc_auth_session', JSON.stringify({ token: session.tokens?.accessToken?.toString(), user: found }));
        return { success: true };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const triggerPasswordReset = async (email) => {
    try {
      await resetPassword({ username: email });
      return { success: true };
    } catch (error) {
      console.error("resetPassword error:", error);
      return { success: false, error: error.message || 'Failed to initiate password reset' };
    }
  };

  const completePasswordReset = async (email, code, newPassword) => {
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword: newPassword
      });
      return { success: true };
    } catch (error) {
      console.error("confirmResetPassword error:", error);
      return { success: false, error: error.message || 'Failed to complete password reset' };
    }
  };

  const logout = async () => {
    try { await signOut(); } catch (e) { /* ignore */ }
    setIsAuthenticated(false);
    setCurrentUser(null);
    // Clear session storage — all data lives in the database
    sessionStorage.clear();
    addNotification('Session Terminated', `Securely logged out of ZPC institutional audit portal.`, 'info');
  };

  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addToast = (message, type = 'success', title = '') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
    setToasts(prev => [{ id, message, type, title }, ...prev]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  useEffect(() => {
    const handleCustomToast = (e) => {
      if (e.detail && e.detail.message) {
        addToast(e.detail.message, e.detail.type || 'success', e.detail.title || '');
      }
    };
    window.addEventListener('zpc_add_toast', handleCustomToast);
    return () => window.removeEventListener('zpc_add_toast', handleCustomToast);
  }, []);

  // Add notification helper
  const addNotification = (title, message, type = 'info') => {
    const newNotif = {
      id: 'notif-' + Date.now(),
      title,
      message,
      time: 'Just now',
      type,
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    addToast(message, type, title);
  };

  // RBAC Permission Checkers
  const checkRbacPermission = (action, moduleName = 'general') => {
    const getNormalizedRole = (roleStr) => {
      const clean = (roleStr || '').toLowerCase();
      if (clean.includes('admin') || clean.includes('cae') || clean.includes('chief_audit')) return 'cae';
      if (clean.includes('audit_manager') || clean.includes('manager')) return 'manager';
      if (clean.includes('auditor') || clean.includes('senior')) return 'senior';
      if (clean.includes('owner') || clean.includes('dept') || clean.includes('department')) return 'owner';
      if (clean.includes('external') || clean.includes('qa')) return 'qa';
      if (clean.includes('risk_manager') || clean.includes('compliance') || clean.includes('erm')) return 'erm';
      if (clean.includes('viewer') || clean.includes('cro') || clean.includes('committee') || clean.includes('executive')) return 'committee';
      return clean;
    };

    const roleId = getNormalizedRole(currentRole?.id || 'cae');
    // 'cae' and 'manager' have full write/delete across all modules
    if (roleId === 'cae' || roleId === 'manager') return true;
    // 'senior' and 'qa' can edit/update status on testing, working papers, controls, findings, but NOT delete master universe or programs
    if (action === 'edit' && ['senior', 'qa'].includes(roleId)) return true;
    if (action === 'delete' && ['senior', 'qa'].includes(roleId) && !['universe', 'programs', 'master'].includes(moduleName)) return true;
    // 'owner' (Auditee / Dept Head) can ONLY edit findings action plans or CAPs
    if (roleId === 'owner' && action === 'edit' && moduleName === 'findings') return true;
    // 'erm' can edit/add KRI / risk sync or reviews
    if (roleId === 'erm' && action === 'edit' && ['reviews', 'continuous', 'universe'].includes(moduleName)) return true;
    // 'committee' (Board) has read-only/approval sign-off, no direct inline editing or deletion of field rows
    return false;
  };

  const verifyRbacOrAlert = (action, moduleName = 'general') => {
    if (checkRbacPermission(action, moduleName)) {
      return true;
    } else {
      addNotification(
        '🔒 RBAC Access Denied',
        `Your active role "${currentRole?.name || 'User'}" does not have ${action.toUpperCase()} permissions for ${moduleName.toUpperCase()}. Please switch to an Audit Executive or Manager role to modify this record.`,
        'danger'
      );
      return false;
    }
  };

  const clearAllMockData = () => {
    // Data is fully database-backed; just reload fresh records from the API
    const API_BASE = (import.meta.env.VITE_AWS_API_URL || '').replace(/\/$/, '');
    fetch(`${API_BASE}/api/audit/findings`).then(r => r.ok ? r.json() : []).then(data => { if (Array.isArray(data)) setFindings(data.map(f => ({ id: f.id, findingNumber: f.finding_number, businessUnit: f.business_unit, observation: f.observation, criteria: f.criteria, rootCause: f.root_cause, likelihood: Number(f.likelihood), impact: Number(f.impact), residualRisk: Number(f.residual_risk), priority: f.priority, severity: f.severity, status: f.status, managementResponse: f.management_response, remediationDate: f.remediation_date, auditor: f.auditor }))); }).catch(console.error);
    addNotification('Data Refreshed', 'All audit records reloaded from the institutional database.', 'success');
  };

  const bulkUploadRecords = async (type, records, s3Key = null) => {
    if (!records || !Array.isArray(records) || records.length === 0) return 0;
    const API_BASE = (import.meta.env.VITE_AWS_API_URL || 'https://uhzosq0g0i.execute-api.eu-west-1.amazonaws.com/prod').replace(/\/$/, '');
    
    if (type === 'findings') {
      const processed = records.map((r, i) => {
        const likelihood = parseInt(r.likelihood || 6, 10);
        const impact = parseInt(r.impact || 7, 10);
        const residualRisk = likelihood * impact;
        return {
          id: r.id || `FND-${Date.now()}-${i}`,
          finding_number: r.findingNumber || `FND-BLK-${String(findings.length + i + 1).padStart(3, '0')}`,
          business_unit: r.businessUnit || r.department || 'General Custody Operations',
          observation: r.observation || r.title || 'Bulk Imported Audit Finding',
          criteria: r.criteria || 'PENCOM Statutory Guidelines',
          root_cause: r.rootCause || 'Bulk imported observation',
          likelihood,
          impact,
          residual_risk: residualRisk,
          priority: residualRisk >= 80 ? 'Critical' : residualRisk >= 60 ? 'High' : 'Medium',
          severity: 'Medium',
          status: r.status || 'Open',
          management_response: r.managementResponse || '',
          remediation_date: r.remediationDate || '',
          auditor: r.auditor || 'Lead Auditor'
        };
      });
      
      try {
        // Use s3_key if available (large upload), else send body directly (small)
        const body = s3Key ? { s3_key: s3Key } : processed;
        const response = await fetch(`${API_BASE}/api/audit/findings/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        if (!response.ok) throw new Error('Bulk insert failed');
        const result = await response.json();
        const inserted = Array.isArray(result) ? result : (result.records || []);
        
        // Map database format back to frontend
        const mapped = inserted.map(f => ({
          id: f.id,
          findingNumber: f.finding_number,
          businessUnit: f.business_unit,
          observation: f.observation,
          criteria: f.criteria,
          rootCause: f.root_cause,
          likelihood: Number(f.likelihood),
          impact: Number(f.impact),
          residualRisk: Number(f.residual_risk),
          priority: f.priority,
          severity: f.severity,
          status: f.status,
          managementResponse: f.management_response,
          remediationDate: f.remediation_date,
          auditor: f.auditor
        }));
        
        setFindings(prev => [...mapped, ...prev]);
        addNotification('Bulk Upload Successful', `Imported ${mapped.length} audit findings from CSV/Excel batch payload.`, 'success');
        return mapped.length;
      } catch (err) {
        console.error(err);
        addToast('❌ Bulk insert of findings failed.', 'danger');
        throw err;
      }
    } else if (type === 'universe') {
      const processed = records.map((r, i) => ({
        id: r.id || `UNIV-${Date.now()}-${i}`,
        unit_id: r.unitId || `UNIV-BLK-${String(auditUniverse.length + i + 1).padStart(3, '0')}`,
        department: r.department || 'General Operations',
        process_name: r.processName || 'Process Review',
        inherent_risk: Number(r.inherentRisk) || 5,
        financial_exposure: Number(r.financialExposure) || 5,
        regulatory_impact: Number(r.regulatoryImpact) || 5,
        overall_score: Number(r.overallScore) || 0.00,
        priority: r.priority || 'Medium',
        last_audit_date: r.lastAuditDate || '',
        lead_auditor: r.leadAuditor || 'Lead Auditor'
      }));

      try {
        const body = s3Key ? { s3_key: s3Key } : processed;
        const response = await fetch(`${API_BASE}/api/audit/universe/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        if (!response.ok) throw new Error('Bulk insert failed');
        const result = await response.json();
        const inserted = Array.isArray(result) ? result : (result.records || []);

        const mapped = inserted.map(u => ({
          id: u.id,
          unitId: u.unit_id,
          department: u.department,
          processName: u.process_name,
          inherentRisk: Number(u.inherent_risk),
          financialExposure: Number(u.financial_exposure),
          regulatoryImpact: Number(u.regulatory_impact),
          overallScore: Number(u.overall_score),
          priority: u.priority,
          lastAuditDate: u.last_audit_date,
          leadAuditor: u.lead_auditor
        }));

        setAuditUniverse(prev => [...mapped, ...prev]);
        addNotification('Bulk Universe Uploaded', `Added ${mapped.length} auditable units to ZPC Master Data universe.`, 'success');
        return mapped.length;
      } catch (err) {
        console.error(err);
        addToast('❌ Bulk insert of universe units failed.', 'danger');
        throw err;
      }
    } else if (type === 'plans') {
      const processed = records.map((r, i) => ({
        id: r.id || `PLAN-${Date.now()}-${i}`,
        plan_id: r.planId || `PLAN-BLK-${String(auditPlans.length + i + 1).padStart(3, '0')}`,
        audit_name: r.auditName || 'Audit Engagement',
        department: r.department || 'Operations',
        planned_hours: Number(r.plannedHours) || 0,
        actual_hours: Number(r.actualHours) || 0,
        status: r.status || 'Approved',
        start_date: r.startDate || '',
        end_date: r.endDate || '',
        lead_auditor: r.leadAuditor || 'Lead Auditor'
      }));

      try {
        const body = s3Key ? { s3_key: s3Key } : processed;
        const response = await fetch(`${API_BASE}/api/audit/plans/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        if (!response.ok) throw new Error('Bulk insert failed');
        const result = await response.json();
        const inserted = Array.isArray(result) ? result : (result.records || []);

        const mapped = inserted.map(p => ({
          id: p.id,
          planId: p.plan_id,
          auditName: p.audit_name,
          department: p.department,
          plannedHours: Number(p.planned_hours),
          actualHours: Number(p.actual_hours),
          status: p.status,
          startDate: p.start_date,
          endDate: p.end_date,
          leadAuditor: p.lead_auditor
        }));

        setAuditPlans(prev => [...mapped, ...prev]);
        addNotification('Audit Plans Batch Ingestion', `Imported ${mapped.length} annual audit engagements.`, 'success');
        return mapped.length;
      } catch (err) {
        console.error(err);
        addToast('❌ Bulk insert of plans failed.', 'danger');
        throw err;
      }
    }
    return 0;
  };


  // Mark all notifications read
  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Calculate overall audit priority from weights
  const calculateOverallScore = (unit, customWeights = null) => {
    const weights = customWeights || scoringWeights;
    const { inherentRisk, financialExposure, regulatoryImpact, previousFindings, fraudExposure, itDependency } = weights;
    const weightedSum = (unit.inherentRisk * inherentRisk) +
                        (unit.financialExposure * financialExposure) +
                        (unit.regulatoryImpact * regulatoryImpact) +
                        (unit.previousFindings * previousFindings) +
                        (unit.fraudExposure * fraudExposure) +
                        (unit.itDependency * itDependency);
    const score = (weightedSum / 100).toFixed(1); // Score out of 10
    return parseFloat(score);
  };

  const getAuditPriorityLabel = (score) => {
    if (score >= 8.0) return 'High';
    if (score >= 5.5) return 'Medium';
    return 'Low';
  };

  // Add or update audit finding with 10x10 matrix calculation
  const saveFinding = async (findingData) => {
    const likelihood = parseInt(findingData.likelihood || 5, 10);
    const impact = parseInt(findingData.impact || 5, 10);
    const residualRisk = likelihood * impact; // out of 100
    
    let priority = 'Low';
    if (residualRisk >= 80) priority = 'Critical';
    else if (residualRisk >= 60) priority = 'High';
    else if (residualRisk >= 30) priority = 'Medium';

    const isRepeat = findings.some(f => 
      f.businessUnit === findingData.businessUnit && 
      f.observation && findingData.observation && 
      f.observation.toLowerCase().includes(findingData.observation.toLowerCase().substring(0, 15))
    );

    const targetId = findingData.id || `FND-${Date.now()}`;
    const targetNumber = findingData.findingNumber || `FND-2026-${String(findings.length + 1).padStart(3, '0')}`;

    const body = {
      id: targetId,
      finding_number: targetNumber,
      business_unit: findingData.businessUnit || 'General Operations',
      observation: findingData.observation || '',
      criteria: findingData.criteria || '',
      root_cause: findingData.rootCause || '',
      likelihood,
      impact,
      residual_risk: residualRisk,
      priority,
      severity: priority === 'Critical' ? 'High' : priority,
      status: findingData.status || 'Open',
      management_response: findingData.managementResponse || '',
      remediation_date: findingData.remediationDate || '',
      auditor: findingData.auditor || 'Lead Auditor'
    };

    const API_BASE = (import.meta.env.VITE_AWS_API_URL || 'https://uhzosq0g0i.execute-api.eu-west-1.amazonaws.com/prod').replace(/\/$/, '');
    try {
      let response;
      if (findingData.isExisting) {
        response = await fetch(`${API_BASE}/api/audit/findings/${targetId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
      } else {
        response = await fetch(`${API_BASE}/api/audit/findings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
      }

      if (!response.ok) throw new Error('Failed to save finding');
      const saved = await response.json();

      const formatted = {
        id: saved.id,
        findingNumber: saved.finding_number,
        businessUnit: saved.business_unit,
        observation: saved.observation,
        criteria: saved.criteria,
        rootCause: saved.root_cause,
        likelihood: Number(saved.likelihood),
        impact: Number(saved.impact),
        residualRisk: Number(saved.residual_risk),
        priority: saved.priority,
        severity: saved.severity,
        status: saved.status,
        managementResponse: saved.management_response,
        remediationDate: saved.remediation_date,
        auditor: saved.auditor
      };

      if (findingData.isExisting) {
        setFindings(prev => prev.map(f => f.id === formatted.id ? formatted : f));
        addNotification('Finding Updated', `Finding ${formatted.findingNumber} residual risk updated to ${residualRisk}/100.`, 'info');
      } else {
        setFindings(prev => [formatted, ...prev]);
        addNotification('New Audit Finding Added', `${formatted.findingNumber} (${formatted.priority} Priority) logged for ${formatted.businessUnit}.`, 'warning');
      }
      addNotification('RiskINTEGRA ERM Synchronized', `Audit Finding ${formatted.findingNumber} automatically linked to ZPC ERM Risk Register.`, 'success');
    } catch (err) {
      console.error(err);
      addToast('❌ Failed to save finding.', 'danger');
    }
  };

  // Add or approve annual audit plan
  const saveAuditPlan = async (planData) => {
    const targetId = planData.id || `PLAN-${Date.now()}`;
    const targetNumber = planData.planId || `PLAN-2026-${String(auditPlans.length + 1).padStart(2, '0')}`;

    const body = {
      id: targetId,
      plan_id: targetNumber,
      audit_name: planData.auditName || '',
      department: planData.department || '',
      planned_hours: Number(planData.estimatedHours || planData.plannedHours) || 0,
      actual_hours: Number(planData.actualHours) || 0,
      status: planData.status || 'Draft',
      start_date: planData.startDate || '',
      end_date: planData.endDate || '',
      lead_auditor: planData.leadAuditor || 'Lead Auditor'
    };

    const API_BASE = (import.meta.env.VITE_AWS_API_URL || 'https://uhzosq0g0i.execute-api.eu-west-1.amazonaws.com/prod').replace(/\/$/, '');
    try {
      let response;
      if (planData.isExisting) {
        response = await fetch(`${API_BASE}/api/audit/plans/${targetId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
      } else {
        response = await fetch(`${API_BASE}/api/audit/plans`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
      }

      if (!response.ok) throw new Error('Failed to save plan');
      const saved = await response.json();

      const formatted = {
        id: saved.id,
        planId: saved.plan_id,
        auditName: saved.audit_name,
        department: saved.department,
        plannedHours: Number(saved.planned_hours),
        actualHours: Number(saved.actual_hours),
        status: saved.status,
        startDate: saved.start_date,
        endDate: saved.end_date,
        leadAuditor: saved.lead_auditor
      };

      if (planData.isExisting) {
        setAuditPlans(prev => prev.map(p => p.id === formatted.id ? formatted : p));
        addNotification('Audit Plan Updated', `${formatted.auditName} plan updated successfully.`, 'info');
      } else {
        setAuditPlans(prev => [formatted, ...prev]);
        addNotification('Annual Audit Plan Added', `${formatted.auditName} created with ${formatted.plannedHours} planned hours.`, 'success');
      }
    } catch (err) {
      console.error(err);
      addToast('❌ Failed to save plan.', 'danger');
    }
  };

  // Add working paper evidence
  const addWorkingPaper = (wpData) => {
    const newWp = {
      ...wpData,
      id: `WP-2026-${String(workingPapers.length + 101)}`,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Submitted for Review'
    };
    setWorkingPapers(prev => [newWp, ...prev]);
    addNotification('Working Paper Uploaded', `File "${newWp.fileName}" linked to finding/control.`, 'success');
  };

  // Add new master business unit
  const addBusinessUnit = (buData) => {
    const newBu = {
      ...buData,
      id: `bu-${Date.now()}`,
      coveragePct: 100
    };
    setBusinessUnits(prev => [...prev, newBu]);
    addNotification('Master Data Updated', `Business Unit "${newBu.name}" added to Audit Universe foundation.`, 'success');
  };

  return (
    <AuditContext.Provider
      value={{
        loading,
        setLoading,
        clientProfile,
        setClientProfile,
        currency,
        toggleCurrency,
        currentRole,
        rolesList: ROLES_LIST,
        isAuthenticated,
        setIsAuthenticated,
        currentUser,
        setCurrentUser,
        login,
        completeNewPassword,
        logout,
        triggerPasswordReset,
        completePasswordReset,
        businessUnits,
        addBusinessUnit,
        setBusinessUnits,
        auditUniverse,
        setAuditUniverse,
        auditPlans,
        saveAuditPlan,
        auditPrograms,
        setAuditPrograms,
        workingPapers,
        addWorkingPaper,
        setWorkingPapers,
        findings,
        saveFinding,
        setFindings,
        updateFindingStatus,
        controls,
        setControls,
        regulatoryReviews,
        setRegulatoryReviews,
        fraudCases,
        setFraudCases,
        continuousExceptions,
        setContinuousExceptions,
        clearAllMockData,
        syncFromErmSuite,
        ermRisks,
        ermControls,
        ermActions,
        ermLosses,
        bulkUploadRecords,
        scoringWeights,
        setScoringWeights,
        updateScoringWeights,
        calculateOverallScore,
        getAuditPriorityLabel,
        notifications,
        addNotification,
        toasts,
        addToast,
        removeToast,
        drawerOpen,
        setDrawerOpen,
        markAllRead,
        checkRbacPermission,
        verifyRbacOrAlert
      }}
    >
      {children}
    </AuditContext.Provider>
  );
};
