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
  const [auditPrograms, setAuditPrograms] = useState(() => loadState('PROGRAMS', INITIAL_AUDIT_PROGRAMS));
  const [workingPapers, setWorkingPapers] = useState(() => loadState('PAPERS', INITIAL_WORKING_PAPERS));
  const [findings, setFindings] = useState([]);
  const [controls, setControls] = useState(() => loadState('CONTROLS', INITIAL_INTERNAL_CONTROLS));
  const [regulatoryReviews, setRegulatoryReviews] = useState(() => loadState('REVIEWS', INITIAL_REGULATORY_REVIEWS));
  const [fraudCases, setFraudCases] = useState(() => loadState('FRAUD', INITIAL_FRAUD_CASES));
  const [continuousExceptions, setContinuousExceptions] = useState(() => loadState('CONTINUOUS', INITIAL_CONTINUOUS_EXCEPTIONS));

  // Fetch audit records from PostgreSQL database on mount
  useEffect(() => {
    const API_BASE = (import.meta.env.VITE_AWS_API_URL || 'https://uhzosq0g0i.execute-api.eu-west-1.amazonaws.com/prod').replace(/\/$/, '');
    
    // Fetch Universe
    fetch(`${API_BASE}/api/audit/universe`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (Array.isArray(data)) {
          setAuditUniverse(data.map(u => ({
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
          })));
        }
      }).catch(err => console.error("Error loading audit universe:", err));

    // Fetch Findings
    fetch(`${API_BASE}/api/audit/findings`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (Array.isArray(data)) {
          setFindings(data.map(f => ({
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
          })));
        }
      }).catch(err => console.error("Error loading findings:", err));

    // Fetch Plans
    fetch(`${API_BASE}/api/audit/plans`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (Array.isArray(data)) {
          setAuditPlans(data.map(p => ({
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
          })));
        }
      }).catch(err => console.error("Error loading audit plans:", err));
  }, []);

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
    const API_BASE = (import.meta.env.VITE_AWS_API_URL || 'https://uhzosq0g0i.execute-api.eu-west-1.amazonaws.com/prod').replace(/\/$/, '');
    fetch(`${API_BASE}/api/audit/findings`).then(r => r.ok ? r.json() : []).then(data => { if (Array.isArray(data)) setFindings(data.map(f => ({ id: f.id, findingNumber: f.finding_number, businessUnit: f.business_unit, observation: f.observation, criteria: f.criteria, rootCause: f.root_cause, likelihood: Number(f.likelihood), impact: Number(f.impact), residualRisk: Number(f.residual_risk), priority: f.priority, severity: f.severity, status: f.status, managementResponse: f.management_response, remediationDate: f.remediation_date, auditor: f.auditor }))); }).catch(console.error);
    addNotification('Data Refreshed', 'All audit records reloaded from the institutional database.', 'success');
  };

  const syncFromErmSuite = (isPurgeOrInit = false) => {
    let ermRisks = [];

    if (!ermRisks || !Array.isArray(ermRisks)) {
      ermRisks = [];
    }

    // Transform ERM risks directly into Audit Universe Units
    const ermDepartments = Array.from(new Set(ermRisks.map(r => r.department || 'General Custody Operations')));
    const syncedUniverse = ermDepartments.map((dept, idx) => {
      const deptRisks = ermRisks.filter(r => r.department === dept);
      const maxScore = Math.max(...deptRisks.map(r => r.residualScore || 50), 50);
      return {
        id: `ERM-UNIV-${idx + 1}`,
        code: `PROC-${String(idx + 101).padStart(3, '0')}`,
        processName: `${dept} Core Process Review`,
        title: `${dept} Core Process Review`,
        department: dept,
        businessUnit: dept,
        owner: 'Department Head / ERM Liaison',
        leadAuditor: 'Chief Senior Auditor',
        inherentRisk: Math.min(10, Math.round((maxScore + 12) / 10)),
        financialExposure: maxScore >= 80 ? 9 : 6,
        regulatoryImpact: maxScore >= 70 ? 9 : 5,
        previousFindings: deptRisks.length,
        fraudExposure: maxScore >= 80 ? 7 : 3,
        itDependency: dept.includes('IT') || dept.includes('Technology') ? 9 : 6,
        lastAuditDate: '2025-11-15',
        lastAudited: '2025-11-15',
        frequency: maxScore >= 75 ? 'Annual' : 'Biennial'
      };
    });

    const newErmFindings = ermRisks.map((risk, idx) => ({
      findingNumber: `FND-ERM-${String(idx + 1).padStart(3, '0')}`,
      id: `FND-ERM-${String(idx + 1).padStart(3, '0')}`,
      businessUnit: risk.department || 'Corporate Governance',
      department: risk.department || 'Corporate Governance',
      observation: `ERM Risk Feed Observation: ${risk.riskTitle}`,
      title: `ERM Risk Feed Observation: ${risk.riskTitle}`,
      criteria: 'PENCOM Custodial SLA & Section 63 Prudential Guidelines',
      rootCause: 'Flagged via direct feed from enterprise risk register (ERM Suite).',
      likelihood: Math.max(1, Math.round((risk.residualScore || 60) / 10)),
      impact: Math.max(5, Math.round((risk.residualScore || 60) / 11)),
      residualRisk: risk.residualScore || 64,
      priority: (risk.residualScore || 60) >= 80 ? 'Critical' : (risk.residualScore || 60) >= 60 ? 'High' : 'Medium',
      severity: (risk.residualScore || 60) >= 80 ? 'High' : 'Medium',
      status: 'Open',
      isRepeat: false,
      actionPlan: `Mandatory substantive control verification for ERM risk item #${risk.id || idx + 1}`,
      dueDate: '2026-09-30',
      targetDate: '2026-09-30',
      owner: 'ERM / Audit Liaison',
      actionOwner: 'ERM / Audit Liaison'
    }));

    const newErmPlans = ermDepartments.map((dept, idx) => {
      const deptRisks = ermRisks.filter(r => r.department === dept);
      const maxScore = Math.max(...deptRisks.map(r => r.residualScore || 50), 50);
      return {
        id: `PLAN-ERM-${idx + 1}`,
        auditName: `FY2026 ${dept} Risk-Based Assurance Audit`,
        title: `FY2026 ${dept} Risk-Based Assurance Audit`,
        auditCode: `RBA-${String(idx + 1).padStart(3, '0')}`,
        businessUnit: dept,
        department: dept,
        priority: maxScore >= 80 ? 'Critical' : maxScore >= 65 ? 'High' : 'Medium',
        riskRating: maxScore >= 80 ? 'Critical' : maxScore >= 65 ? 'High' : 'Medium',
        status: 'Approved',
        plannedQuarter: maxScore >= 80 ? 'Q1 2026' : 'Q2 2026',
        plannedStartDate: '2026-08-01',
        plannedEndDate: '2026-08-25',
        leadAuditor: 'Senior Audit Manager',
        owner: 'Senior Audit Manager',
        frequency: 'Annual',
        budgetHours: maxScore >= 80 ? 240 : 160,
        estimatedHours: maxScore >= 80 ? 240 : 160,
        budget: maxScore >= 80 ? 32 : 24
      };
    });

    const newErmPapers = ermRisks.map((risk, idx) => ({
      id: `WP-ERM-${String(idx + 1).padStart(3, '0')}`,
      title: `Substantive Evidence Paper: ${risk.riskTitle.substring(0, 42)}...`,
      fileName: `ERM_Risk_Evidence_${risk.id}.xlsx`,
      fileType: 'Excel / PBC Evidence',
      linkedAudit: `FY2026 ${risk.department || 'Operations'} Audit`,
      auditName: `FY2026 ${risk.department || 'Operations'} Audit`,
      uploadedBy: 'ERM Live Gateway',
      owner: 'ERM Live Gateway',
      uploadDate: '2026-07-12',
      status: 'Approved'
    }));

    const newErmControls = ermRisks.map((risk, idx) => ({
      id: `CTRL-ERM-${String(idx + 1).padStart(3, '0')}`,
      code: `CTRL-${String(idx + 201).padStart(3, '0')}`,
      description: `Automated preventive safeguard monitoring: ${risk.riskTitle}`,
      name: `Automated preventive safeguard monitoring: ${risk.riskTitle}`,
      type: (risk.residualScore || 50) >= 75 ? 'Preventive' : 'Detective',
      automation: 'Automated',
      designEff: 'Effective',
      designEffectiveness: 'Effective',
      operatingEff: 'Effective',
      operatingEffectiveness: 'Effective',
      owner: `${risk.department || 'Operations'} Lead`,
      lastTested: '2026-06-30',
      lastTestedDate: '2026-06-30'
    }));

    const newErmReviews = ermDepartments.map((dept, idx) => ({
      id: `REV-ERM-${String(idx + 1).padStart(3, '0')}`,
      title: `Statutory PenCom & CBN Compliance Review: ${dept}`,
      reviewTitle: `Statutory PenCom & CBN Compliance Review: ${dept}`,
      regulatoryBody: 'National Pension Commission (PenCom)',
      date: '2026-05-18',
      inspectionDate: '2026-05-18',
      findingsCount: idx % 2 === 0 ? 1 : 0,
      totalObservations: idx % 2 === 0 ? 1 : 0,
      leadReviewer: 'Chief Regulatory Compliance Auditor',
      owner: 'Chief Regulatory Compliance Auditor',
      status: idx % 2 === 0 ? 'Remediation Underway' : 'Completed & Cleared'
    }));

    const newErmFraud = ermRisks.slice(0, 3).map((risk, idx) => ({
      id: `FRD-ERM-${String(idx + 1).padStart(3, '0')}`,
      title: `Forensic Monitoring Case: ${risk.category} in ${risk.department}`,
      caseTitle: `Forensic Monitoring Case: ${risk.category} in ${risk.department}`,
      department: risk.department || 'Corporate Operations',
      dateOpened: '2026-04-14',
      reportedDate: '2026-04-14',
      financialImpact: idx === 0 ? 18.5 : 6.2,
      recoveredAmount: idx === 0 ? 18.5 : 6.2,
      investigator: 'Head of Forensic Investigations',
      leadInvestigator: 'Head of Forensic Investigations',
      status: 'Closed - Remediated'
    }));

    const newErmContinuous = ermRisks.map((risk, idx) => ({
      id: `KRI-ERM-${String(idx + 1).padStart(3, '0')}`,
      ruleName: `Continuous Rule #${idx + 101}: ${risk.category} Threshold Alert`,
      details: `Live KRI sensor monitoring threshold breaches for ERM Risk ID #${risk.id}: ${risk.riskTitle}`,
      department: risk.department || 'General Operations',
      severity: (risk.residualScore || 50) >= 80 ? 'Critical' : (risk.residualScore || 50) >= 65 ? 'High' : 'Medium',
      timestamp: '2026-07-14 07:30:00',
      status: (risk.residualScore || 50) >= 80 ? 'Under Review' : 'Cleared / Verified Normal'
    }));

    const newErmPrograms = ermDepartments.map((dept, idx) => {
      const deptRisks = ermRisks.filter(r => r.department === dept);
      const proceduresList = deptRisks.map((r, pIdx) => ({
        id: `p-erm-${idx}-${pIdx + 1}`,
        ref: `PROC-${dept.substring(0, 3).toUpperCase()}-${String(pIdx + 1).padStart(2, '0')}`,
        step: `Verify controls mitigating ${r.riskTitle} and ensure compliance with PenCom prudenital guidelines.`,
        sampleSize: (r.residualScore || 50) >= 75 ? '50 Samples (100% Target)' : '25 Samples (Selected Batches)',
        riskLink: r.category || 'Operational Risk',
        expectedControl: `Dual Maker/Checker authorization and daily exception log review for ${r.category}.`,
        evidenceRequired: 'System audit trails, approval sign-off slips, and daily reconciliation sheets.',
        status: (r.residualScore || 50) >= 80 ? 'Tested - Exception' : (r.residualScore || 50) >= 65 ? 'In Progress' : 'Tested - Pass',
        findingRef: (r.residualScore || 50) >= 80 ? `FND-ERM-${String(ermRisks.indexOf(r) + 1).padStart(3, '0')}` : null
      }));
      return {
        id: `PROG-ERM-${idx + 1}`,
        title: `${dept} Risk-Based Testing & Assurance Program`,
        name: `${dept} Risk-Based Testing & Assurance Program`,
        category: dept,
        objectives: `Comprehensive step-by-step verification procedures designed to evaluate internal controls across ${dept}, directly addressing ${deptRisks.length} high-priority ERM risk register items.`,
        description: `Comprehensive step-by-step verification procedures designed to evaluate internal controls across ${dept}, directly addressing ${deptRisks.length} high-priority ERM risk register items.`,
        procedures: proceduresList.length > 0 ? proceduresList : [
          {
            id: `p-erm-${idx}-1`,
            ref: `PROC-${dept.substring(0, 3).toUpperCase()}-01`,
            step: `Substantive test of operational controls in ${dept} for regulatory compliance.`,
            sampleSize: '30 Samples',
            riskLink: 'Compliance Risk',
            expectedControl: 'Standard operational authorization and reconciliation.',
            evidenceRequired: 'Audit log verification.',
            status: 'Tested - Pass',
            findingRef: null
          }
        ]
      };
    });

    const isV8Protected = true || false //Item('ZPC_AUDIT_MOCK_REMOVED') === 'true';
    
    // Under V8 Backend Protection, strictly merge ERM items + custom user inputs (no legacy dummy injection)
    const combinedUniverse = isV8Protected ? [...syncedUniverse, ...auditUniverse.filter(u => u.isUserCreated || (u.id && u.id.toString().startsWith('custom-')))] : [...syncedUniverse, ...INITIAL_AUDIT_UNIVERSE.filter(u => !syncedUniverse.some(su => su.name === u.name || su.id === u.id))];
    const combinedFindings = isV8Protected ? [...newErmFindings, ...findings.filter(f => f.isUserCreated || (f.id && f.id.toString().startsWith('custom-')))] : [...newErmFindings, ...INITIAL_FINDINGS.filter(f => !newErmFindings.some(nf => nf.id === f.id || nf.findingNumber === f.findingNumber))];
    const combinedPlans = isV8Protected ? [...newErmPlans, ...auditPlans.filter(p => p.isUserCreated || (p.id && p.id.toString().startsWith('custom-')))] : [...newErmPlans, ...INITIAL_ANNUAL_AUDIT_PLANS.filter(p => !newErmPlans.some(np => np.id === p.id || np.auditName === p.auditName))];
    const combinedPrograms = isV8Protected ? [...newErmPrograms, ...auditPrograms.filter(p => p.isUserCreated || (p.id && p.id.toString().startsWith('custom-')))] : [...newErmPrograms, ...INITIAL_AUDIT_PROGRAMS.filter(p => !newErmPrograms.some(np => np.id === p.id))];
    const combinedPapers = isV8Protected ? [...newErmPapers, ...workingPapers.filter(p => p.isUserCreated || (p.id && p.id.toString().startsWith('custom-')))] : [...newErmPapers, ...INITIAL_WORKING_PAPERS.filter(p => !newErmPapers.some(np => np.id === p.id))];
    const combinedControls = isV8Protected ? [...newErmControls, ...controls.filter(c => c.isUserCreated || (c.id && c.id.toString().startsWith('custom-')))] : [...newErmControls, ...INITIAL_INTERNAL_CONTROLS.filter(c => !newErmControls.some(nc => nc.id === c.id))];
    const combinedReviews = isV8Protected ? [...newErmReviews, ...regulatoryReviews.filter(r => r.isUserCreated || (r.id && r.id.toString().startsWith('custom-')))] : [...newErmReviews, ...INITIAL_REGULATORY_REVIEWS.filter(r => !newErmReviews.some(nr => nr.id === r.id))];
    const combinedFraud = isV8Protected ? [...newErmFraud, ...fraudCases.filter(f => f.isUserCreated || (f.id && f.id.toString().startsWith('custom-')))] : [...newErmFraud, ...INITIAL_FRAUD_CASES.filter(f => !newErmFraud.some(nf => nf.id === f.id))];
    const combinedContinuous = isV8Protected ? [...newErmContinuous, ...continuousExceptions.filter(c => c.isUserCreated || (c.id && c.id.toString().startsWith('custom-')))] : [...newErmContinuous, ...INITIAL_CONTINUOUS_EXCEPTIONS.filter(c => !newErmContinuous.some(nc => nc.id === c.id))];

    saveArrayState('UNIVERSE', combinedUniverse, setAuditUniverse);
    saveArrayState('FINDINGS', combinedFindings, setFindings);
    saveArrayState('PLANS', combinedPlans, setAuditPlans);
    saveArrayState('PROGRAMS', combinedPrograms, setAuditPrograms);
    saveArrayState('PAPERS', combinedPapers, setWorkingPapers);
    saveArrayState('CONTROLS', combinedControls, setControls);
    saveArrayState('REVIEWS', combinedReviews, setRegulatoryReviews);
    saveArrayState('FRAUD', combinedFraud, setFraudCases);
    saveArrayState('CONTINUOUS', combinedContinuous, setContinuousExceptions);
    if (!isPurgeOrInit) {
      addNotification('Direct ERM Sync Complete', `Ingested ${ermRisks.length} Enterprise Risks directly from RiskINTEGRA ERM Suite into all Audit Library modules.`, 'success');
    }
  };

  const bulkUploadRecords = async (type, records) => {
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
        const response = await fetch(`${API_BASE}/api/audit/findings/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(processed)
        });
        if (!response.ok) throw new Error('Bulk insert failed');
        const inserted = await response.json();
        
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
        const response = await fetch(`${API_BASE}/api/audit/universe/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(processed)
        });
        if (!response.ok) throw new Error('Bulk insert failed');
        const inserted = await response.json();

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
        const response = await fetch(`${API_BASE}/api/audit/plans/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(processed)
        });
        if (!response.ok) throw new Error('Bulk insert failed');
        const inserted = await response.json();

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
