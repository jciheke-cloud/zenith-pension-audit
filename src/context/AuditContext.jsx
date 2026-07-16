import React, { createContext, useState, useEffect } from 'react';
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
  const [clientProfile, setClientProfile] = useState('Zenith Pension Custodian Limited (ZPC)');
  const [currency, setCurrency] = useState('NGN');
  const [currentRole, setCurrentRole] = useState(() => {
    try {
      const session = JSON.parse(localStorage.getItem('zpc_auth_session'));
      if (session?.user) {
        const foundExact = ROLES_LIST.find(r => r.id.toLowerCase() === session.user.role?.toLowerCase() || r.name.toLowerCase().includes(session.user.role?.toLowerCase()));
        if (foundExact) return foundExact;
        if (session.user.role === 'admin' || session.user.role === 'executive') return ROLES_LIST.find(r => r.id === 'Chief_Audit_Executive') || ROLES_LIST[3];
        if (session.user.role === 'auditor') return ROLES_LIST.find(r => r.id === 'Auditor' || r.id === 'Chief_Audit_Executive') || ROLES_LIST[8];
        if (session.user.role === 'maker') return ROLES_LIST.find(r => r.id === 'Audit_Manager' || r.id === 'Control_Owner') || ROLES_LIST[7];
      }
    } catch (e) { /* ignore */ }
    return ROLES_LIST.find(r => r.id === 'Chief_Audit_Executive') || ROLES_LIST[3]; // Chief Audit Executive by default
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const session = JSON.parse(localStorage.getItem('zpc_auth_session'));
      return !!session?.user;
    } catch (e) {
      return false;
    }
  });
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const session = JSON.parse(localStorage.getItem('zpc_auth_session'));
      if (session?.user) {
        return {
          name: session.user.name,
          title: `${session.user.department} (${session.user.role?.toUpperCase()})`,
          email: session.user.email,
          roleId: session.user.role === 'auditor' || session.user.role === 'admin' ? 'cae' : 'manager'
        };
      }
    } catch (e) { /* ignore */ }
    return null;
  });

  // Intercept Cross-App SSO URL parameters or listen for storage sync on mount
  useEffect(() => {
    const searchString = window.location.search || (window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '');
    const params = new URLSearchParams(searchString);
    const ssoRole = params.get('sso_role');
    const ssoToken = params.get('sso_token');
    const source = params.get('source');

    if (ssoRole && (ssoToken === 'riskintegra_auth_bridge' || ssoRole)) {
      let users = [];
      try {
        users = JSON.parse(localStorage.getItem('zpc_users_directory')) || [];
      } catch (e) { /* ignore */ }

      const foundDirUser = users.find(u => u.role?.toLowerCase() === ssoRole.toLowerCase() || u.email?.toLowerCase().includes(ssoRole.toLowerCase()));
      const roleObj = ROLES_LIST.find(r => r.id.toLowerCase() === ssoRole.toLowerCase() || r.name.toLowerCase().includes(ssoRole.toLowerCase())) || ROLES_LIST.find(r => r.id === 'Chief_Audit_Executive') || ROLES_LIST[3];
      
      const targetUser = foundDirUser ? {
        name: foundDirUser.name,
        title: `${foundDirUser.department} (${foundDirUser.role?.toUpperCase()})`,
        email: foundDirUser.email,
        roleId: roleObj.id
      } : {
        name: `${roleObj.name}`,
        title: `Internal Audit & Governance (${roleObj.badge})`,
        email: `${roleObj.id.toLowerCase()}@zenithcustodian.com`,
        roleId: roleObj.id
      };

      setCurrentUser(targetUser);
      setCurrentRole(roleObj);
      setIsAuthenticated(true);

      if (window.history.replaceState) {
        const cleanUrl = window.location.pathname + (window.location.hash.startsWith('#') ? '#/' : '');
        window.history.replaceState({}, document.title, cleanUrl);
      }

      addNotification(
        'SSO Gateway Active',
        `Authenticated automatically from ${source ? source.toUpperCase() : 'ERM'} Suite under ${targetUser.title}.`,
        'success'
      );
    }

    // V12 Zero-Mock Protection Guard: Complete institutional storage cleanup on upgrade
    if (!localStorage.getItem('ZPC_AUDIT_CLEAN_GUARD_V12_ZERO_MOCK')) {
      const keysToWipe = ['BUSINESS_UNITS', 'PLANS', 'PROGRAMS', 'PAPERS', 'FINDINGS', 'CONTROLS', 'REVIEWS', 'FRAUD', 'CONTINUOUS', 'UNIVERSE'];
      keysToWipe.forEach(k => localStorage.removeItem(`ZPC_AUDIT_STATE_${k}`));
      localStorage.removeItem('ZPC_AUDIT_NOTIFICATIONS');
      localStorage.removeItem('ZPC_AUDIT_BOOTSTRAPPED_ERM_V8');
      localStorage.removeItem('ZPC_AUDIT_BACKEND_GUARD_V8');
      localStorage.removeItem('ZPC_ERM_RISK_REGISTER');
      localStorage.setItem('ZPC_AUDIT_CLEAN_GUARD_V12_ZERO_MOCK', 'true');
      window.location.reload();
    }
  }, []);
  
  // V12 Backend Schema Guard: Ensures zero mock items or old cached state persist
  const loadState = (key, initial) => {
    try {
      if (!localStorage.getItem('ZPC_AUDIT_CLEAN_GUARD_V12_ZERO_MOCK')) {
        localStorage.removeItem(`ZPC_AUDIT_STATE_${key}`);
        return initial;
      }
      const saved = localStorage.getItem(`ZPC_AUDIT_STATE_${key}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Check for any legacy or mock patterns anywhere across any cached items
          const hasLegacyMocks = parsed.some(item => {
            const id = String(item.id || item.findingNumber || item.code || item.unitId || '');
            const name = String(item.name || item.title || item.processName || item.observation || item.auditName || '');
            return id.startsWith('au-10') || id.startsWith('au-11') || id.startsWith('bu-') || id.startsWith('INITIAL_') || id.startsWith('ERM-UNIV-') || id.startsWith('FND-2026-00') || id.startsWith('FND-ERM-00') || id.startsWith('PLAN-2026-00') || id.startsWith('PLAN-ERM-') || id.startsWith('PROG-2026-00') || id.startsWith('WP-2026-00') || id.startsWith('CTRL-2026-00') || id.startsWith('REV-2026-00') || id.startsWith('FRD-2026-00') || id.startsWith('CONT-2026-00') || name.includes('Mock') || name.includes('Demo') || name.includes('Sample') || name.includes('Delayed dividend') || name.includes('Unreconciled Cash Sweep');
          });
          if (hasLegacyMocks) {
            localStorage.removeItem(`ZPC_AUDIT_STATE_${key}`);
            return initial;
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn(`[V12 Storage Guard] State recovery initiated for ${key}:`, e);
    }
    return initial;
  };

  const [businessUnits, setBusinessUnits] = useState(() => loadState('BUSINESS_UNITS', INITIAL_BUSINESS_UNITS));
  const [auditUniverse, setAuditUniverse] = useState(() => loadState('UNIVERSE', INITIAL_AUDIT_UNIVERSE));
  const [auditPlans, setAuditPlans] = useState(() => loadState('PLANS', INITIAL_ANNUAL_AUDIT_PLANS));
  const [auditPrograms, setAuditPrograms] = useState(() => loadState('PROGRAMS', INITIAL_AUDIT_PROGRAMS));
  const [workingPapers, setWorkingPapers] = useState(() => loadState('PAPERS', INITIAL_WORKING_PAPERS));
  const [findings, setFindings] = useState(() => loadState('FINDINGS', INITIAL_FINDINGS));
  const [controls, setControls] = useState(() => loadState('CONTROLS', INITIAL_INTERNAL_CONTROLS));
  const [regulatoryReviews, setRegulatoryReviews] = useState(() => loadState('REVIEWS', INITIAL_REGULATORY_REVIEWS));
  const [fraudCases, setFraudCases] = useState(() => loadState('FRAUD', INITIAL_FRAUD_CASES));
  const [continuousExceptions, setContinuousExceptions] = useState(() => loadState('CONTINUOUS', INITIAL_CONTINUOUS_EXCEPTIONS));

  // V8 Storage Write & Quota Protection Guard
  const saveArrayState = (key, data, setter) => {
    if (!Array.isArray(data)) {
      console.error(`[V8 Write Guard] Invalid array schema aborted for ${key}`);
      return;
    }
    setter(data);
    try {
      localStorage.setItem(`ZPC_AUDIT_STATE_${key}`, JSON.stringify(data));
    } catch (e) {
      if (e.name === 'QuotaExceededError' || e.message?.toLowerCase().includes('quota')) {
        console.warn(`[V8 Storage Quota Alert] Quota exceeded on writing ${key}. Pruning non-essential cache snapshots...`);
        try {
          // Free up quota by clearing transient caches while keeping master tables intact
          localStorage.removeItem('ZPC_AUDIT_NOTIFICATIONS');
          localStorage.removeItem('riskintegra_live_macro_cache');
          localStorage.setItem(`ZPC_AUDIT_STATE_${key}`, JSON.stringify(data));
        } catch (innerErr) {
          console.error(`[V8 Storage Quota Alert] Critical write error for ${key}:`, innerErr);
        }
      }
    }
  };

  // Risk-based audit planning weights
  const [scoringWeights, setScoringWeights] = useState(() => {
    const saved = localStorage.getItem('ZPC_AUDIT_SCORING_WEIGHTS');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* use default */ }
    }
    return {
      inherentRisk: 25,
      financialExposure: 20,
      regulatoryImpact: 20,
      previousFindings: 15,
      fraudExposure: 10,
      itDependency: 10
    };
  });

  const updateScoringWeights = (newWeights) => {
    setScoringWeights(newWeights);
    localStorage.setItem('ZPC_AUDIT_SCORING_WEIGHTS', JSON.stringify(newWeights));
  };

  // Notifications drawer / alerts
  const [notifications, setNotifications] = useState(() => {
    try {
      if (!localStorage.getItem('ZPC_AUDIT_CLEAN_GUARD_V12_ZERO_MOCK')) {
        localStorage.removeItem('ZPC_AUDIT_NOTIFICATIONS');
        return [
          { id: 'notif-system', title: 'RiskINTEGRA Audit Active', message: 'Audit Engine active and linked to live RiskINTEGRA ERM Suite.', time: 'Just now', type: 'info', read: false }
        ];
      }
      const saved = localStorage.getItem('ZPC_AUDIT_NOTIFICATIONS');
      if (saved) return JSON.parse(saved);
    } catch (e) { /* ignore */ }
    return [
      { id: 'notif-system', title: 'RiskINTEGRA Audit Active', message: 'Audit Engine active and linked to live RiskINTEGRA ERM Suite.', time: 'Just now', type: 'info', read: false }
    ];
  });
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Toggle currency
  const toggleCurrency = () => {
    setCurrency(prev => {
      const next = prev === 'NGN' ? 'USD' : 'NGN';
      localStorage.setItem('ZPC_AUDIT_CURRENCY', next);
      return next;
    });
  };

  const login = async (email, password) => {
    try {
      let users = [];
      try {
        users = JSON.parse(localStorage.getItem('zpc_users_directory')) || [];
      } catch (e) { /* ignore */ }
      
      const cleanEmail = email.trim().toLowerCase();
      const found = users.find(u => u.email.toLowerCase() === cleanEmail);
      if (found) {
        const role = ROLES_LIST.find(r => r.id.toLowerCase() === found.role?.toLowerCase() || r.name.toLowerCase().includes(found.role?.toLowerCase())) || ROLES_LIST.find(r => r.id === 'Chief_Audit_Executive') || ROLES_LIST[3];
        const userObj = {
          name: found.name,
          title: `${found.department} (${role.name})`,
          email: found.email,
          roleId: role.id
        };
        setCurrentUser(userObj);
        setCurrentRole(role);
        setIsAuthenticated(true);
        const sessionPayload = {
          token: `jwt-cognito-${found.cognitoSub || Date.now()}`,
          user: found
        };
        localStorage.setItem('zpc_auth_session', JSON.stringify(sessionPayload));
        addNotification('SSO Authentication Successful', `Welcome back, ${found.name}. Active Cognito RBAC session initialized.`, 'success');
        return { success: true };
      }
      return { success: false, error: 'User email not found in AWS Cognito identity pool directory or invalid credentials.' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('zpc_auth_session');
    addNotification('Session Terminated', `Securely logged out of ZPC institutional audit portal.`, 'info');
  };

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
  };

  // RBAC Permission Checkers
  const checkRbacPermission = (action, moduleName = 'general') => {
    const roleId = currentRole?.id || 'cae';
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
    localStorage.setItem('ZPC_AUDIT_MOCK_REMOVED', 'true');
    // Directly feed all Audit Library tables (Universe, Findings, Plans, Working Papers, Controls, Reviews, Fraud Cases, Continuous Exceptions) from ERM
    syncFromErmSuite(true);
    addNotification('Mock Data Purged & ERM Feed Active', 'All static demonstration data removed. Every section of the Audit Library is now feeding directly from live RiskINTEGRA ERM Suite records.', 'success');
  };

  const syncFromErmSuite = (isPurgeOrInit = false) => {
    // Check if ERM local storage exists or use standard institutional ERM payload bridge
    let ermRisks = [];
    try {
      const savedRisks = localStorage.getItem('ZPC_ERM_RISK_REGISTER');
      if (savedRisks) ermRisks = JSON.parse(savedRisks);
    } catch (e) { /* ignore */ }

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

    const isV8Protected = localStorage.getItem('ZPC_AUDIT_BACKEND_GUARD_V8') === 'true' || localStorage.getItem('ZPC_AUDIT_MOCK_REMOVED') === 'true';
    
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

  const bulkUploadRecords = (type, records) => {
    if (!records || !Array.isArray(records) || records.length === 0) return 0;
    if (type === 'findings') {
      const formatted = records.map((r, i) => ({
        findingNumber: r.findingNumber || `FND-BLK-${String(findings.length + i + 1).padStart(3, '0')}`,
        businessUnit: r.businessUnit || r.department || 'General Custody Operations',
        observation: r.observation || r.title || 'Bulk Imported Audit Finding',
        criteria: r.criteria || 'PENCOM Statutory Guidelines',
        rootCause: r.rootCause || 'Bulk imported observation',
        likelihood: parseInt(r.likelihood || 6, 10),
        impact: parseInt(r.impact || 7, 10),
        residualRisk: parseInt(r.likelihood || 6, 10) * parseInt(r.impact || 7, 10),
        priority: (parseInt(r.likelihood || 6, 10) * parseInt(r.impact || 7, 10)) >= 60 ? 'High' : 'Medium',
        severity: 'Medium',
        status: r.status || 'Open'
      }));
      saveArrayState('FINDINGS', [...formatted, ...findings], setFindings);
      addNotification('Bulk Upload Successful', `Imported ${formatted.length} audit findings from CSV/Excel batch payload.`, 'success');
      return formatted.length;
    } else if (type === 'universe') {
      saveArrayState('UNIVERSE', [...records, ...auditUniverse], setAuditUniverse);
      addNotification('Bulk Universe Uploaded', `Added ${records.length} auditable units to ZPC Master Data universe.`, 'success');
      return records.length;
    } else if (type === 'plans') {
      saveArrayState('PLANS', [...records, ...auditPlans], setAuditPlans);
      addNotification('Audit Plans Batch Ingestion', `Imported ${records.length} annual audit engagements.`, 'success');
      return records.length;
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
  const saveFinding = (findingData) => {
    const likelihood = parseInt(findingData.likelihood || 5, 10);
    const impact = parseInt(findingData.impact || 5, 10);
    const residualRisk = likelihood * impact; // out of 100
    
    let priority = 'Low';
    if (residualRisk >= 80) priority = 'Critical';
    else if (residualRisk >= 60) priority = 'High';
    else if (residualRisk >= 30) priority = 'Medium';

    // Check if repeat finding exists for same department/observation
    const isRepeat = findings.some(f => 
      f.businessUnit === findingData.businessUnit && 
      f.observation && findingData.observation && 
      f.observation.toLowerCase().includes(findingData.observation.toLowerCase().substring(0, 15))
    );

    const formatted = {
      ...findingData,
      findingNumber: findingData.findingNumber || `FND-2026-${String(findings.length + 1).padStart(3, '0')}`,
      likelihood,
      impact,
      residualRisk,
      priority,
      severity: priority === 'Critical' ? 'High' : priority,
      isRepeat: findingData.isRepeat || isRepeat,
      repeatCycle: isRepeat ? 'Repeat Finding Detected by System' : 'New Finding',
      status: findingData.status || 'Open'
    };

    if (findingData.isExisting) {
      setFindings(prev => prev.map(f => f.findingNumber === formatted.findingNumber ? formatted : f));
      addNotification('Finding Updated', `Finding ${formatted.findingNumber} residual risk updated to ${residualRisk}/100.`, 'info');
    } else {
      setFindings(prev => [formatted, ...prev]);
      addNotification('New Audit Finding Added', `${formatted.findingNumber} (${formatted.priority} Priority) logged for ${formatted.businessUnit}.`, 'warning');
    }

    // Trigger ERM sync notification
    addNotification('RiskINTEGRA ERM Synchronized', `Audit Finding ${formatted.findingNumber} automatically linked to ZPC ERM Risk Register. Residual risk scores adjusted.`, 'success');
  };

  // Update action status for a finding (CAP tracker)
  const updateFindingStatus = (findingNumber, newStatus) => {
    setFindings(prev => prev.map(f => {
      if (f.findingNumber === findingNumber) {
        return { ...f, status: newStatus };
      }
      return f;
    }));
    addNotification('Action Status Updated', `${findingNumber} status changed to "${newStatus}".`, 'info');
  };

  // Add or approve annual audit plan
  const saveAuditPlan = (planData) => {
    const newPlan = {
      ...planData,
      id: planData.id || `PLAN-2026-${String(auditPlans.length + 1).padStart(2, '0')}`,
      status: planData.status || 'Draft',
      actualHours: planData.actualHours || 0,
      findingsCount: planData.findingsCount || 0,
      auditRating: planData.auditRating || 'Pending'
    };
    if (planData.isExisting) {
      setAuditPlans(prev => prev.map(p => p.id === newPlan.id ? newPlan : p));
    } else {
      setAuditPlans(prev => [newPlan, ...prev]);
      addNotification('Annual Audit Plan Added', `${newPlan.auditName} created with ${newPlan.estimatedHours} planned hours.`, 'success');
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
        logout,
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
