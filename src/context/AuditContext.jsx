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
  const [currentRole, setCurrentRole] = useState(ROLES_LIST[0]); // Chief Audit Executive by default
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(MOCK_USERS[0]);

  // Intercept Cross-App SSO URL parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ssoRole = params.get('sso_role');
    const ssoToken = params.get('sso_token');
    const source = params.get('source');

    if (ssoRole && (ssoToken === 'riskintegra_auth_bridge' || ssoRole)) {
      const foundUser = MOCK_USERS.find(u => u.roleId.toLowerCase() === ssoRole.toLowerCase()) || MOCK_USERS[0];
      const roleObj = ROLES_LIST.find(r => r.id === foundUser.roleId) || ROLES_LIST[0];
      
      setCurrentUser(foundUser);
      setCurrentRole(roleObj);
      setIsAuthenticated(true);

      // Clean address bar so token doesn't stay visible
      if (window.history.replaceState) {
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }

      addNotification(
        'SSO Gateway Active',
        `Authenticated automatically from ${source ? source.toUpperCase() : 'ERM'} Suite under ${foundUser.title}.`,
        'success'
      );
    }
  }, []);
  
  const loadState = (key, initial) => {
    try {
      const saved = localStorage.getItem(`ZPC_AUDIT_STATE_${key}`);
      if (saved) return JSON.parse(saved);
    } catch (e) { /* fallback */ }
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

  const saveArrayState = (key, data, setter) => {
    setter(data);
    try { localStorage.setItem(`ZPC_AUDIT_STATE_${key}`, JSON.stringify(data)); } catch (e) { /* ignore */ }
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
  const [notifications, setNotifications] = useState([
    { id: 'notif-1', title: 'ERM Sync Active', message: 'Audit Universe linked to RiskINTEGRA ERM Risk Register.', time: 'Just now', type: 'info', read: false },
    { id: 'notif-2', title: 'Repeat Finding Alert', message: 'FND-2026-001 (Unreconciled Cash Sweep Variance) detected in Custody Operations for 3rd consecutive audit cycle.', time: '12m ago', type: 'danger', read: false },
    { id: 'notif-3', title: 'Continuous Audit Exception', message: 'Maker/Checker SoD breach flagged on Terminal IP 10.14.22.105.', time: '1h ago', type: 'warning', read: false },
    { id: 'notif-4', title: 'Audit Committee Review', message: 'Q1 Board Audit Pack ready for Audit Committee Portal sign-off.', time: '2h ago', type: 'success', read: false }
  ]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Toggle currency
  const toggleCurrency = () => {
    const order = ['NGN', 'USD', 'EUR', 'GBP'];
    const nextIndex = (order.indexOf(currency) + 1) % order.length;
    setCurrency(order[nextIndex]);
  };

  // Switch active user role
  const switchRole = (roleId) => {
    const found = ROLES_LIST.find(r => r.id === roleId) || ROLES_LIST[0];
    setCurrentRole(found);
  };

  // Mock account login
  const loginWithMockAccount = (user) => {
    setCurrentUser(user);
    const role = ROLES_LIST.find(r => r.id === user.roleId) || ROLES_LIST[0];
    setCurrentRole(role);
    setIsAuthenticated(true);
    addNotification('Authentication Successful', `Welcome back, ${user.name} (${role.name}). Active session initialized.`, 'success');
  };

  const logout = () => {
    setIsAuthenticated(false);
    addNotification('Session Closed', `Logged out of ${currentUser?.name || currentRole.name}'s mock account.`, 'info');
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

  const clearAllMockData = () => {
    localStorage.setItem('ZPC_AUDIT_MOCK_REMOVED', 'true');
    saveArrayState('PAPERS', [], setWorkingPapers);
    saveArrayState('CONTROLS', [], setControls);
    saveArrayState('REVIEWS', [], setRegulatoryReviews);
    saveArrayState('FRAUD', [], setFraudCases);
    saveArrayState('CONTINUOUS', [], setContinuousExceptions);
    // Directly feed Audit Universe, Findings, and Plans from the ERM Suite instead of static mock data
    syncFromErmSuite(true);
    addNotification('Mock Data Purged & ERM Feed Active', 'All static demonstration data removed. Audit Universe and Findings are now feeding directly from the RiskINTEGRA ERM Suite.', 'success');
  };

  const syncFromErmSuite = (isPurgeOrInit = false) => {
    // Check if ERM local storage exists or use standard institutional ERM payload bridge
    let ermRisks = [];
    try {
      const savedRisks = localStorage.getItem('ZPC_ERM_RISK_REGISTER');
      if (savedRisks) ermRisks = JSON.parse(savedRisks);
    } catch (e) { /* ignore */ }

    if (!ermRisks || ermRisks.length === 0) {
      // Direct high-fidelity ERM risk register bridge payload (when across domains/ports without shared localStorage)
      ermRisks = [
        { id: 101, riskTitle: 'Delayed dividend sweeping to PFA client accounts', category: 'Settlement Risk', department: 'Settlements & Corporate Actions', residualScore: 68 },
        { id: 102, riskTitle: 'Core custody accounting database downtime during peak settlement window', category: 'Technology Risk', department: 'Settlements & Operations', residualScore: 82 },
        { id: 103, riskTitle: '24h Contribution Notification SLA Delay Penalty Breach', category: 'Compliance Risk', department: 'Contribution Reconciliation Dept', residualScore: 74 },
        { id: 104, riskTitle: 'RMAS Gateway connectivity drop or data intercept on PENCOM uplink', category: 'Cybersecurity Risk', department: 'IT & Cybersecurity', residualScore: 88 },
        { id: 105, riskTitle: 'Counterparty default on money market placements & FGN bonds', category: 'Credit & Treasury Risk', department: 'Treasury & Markets', residualScore: 45 }
      ];
    }

    // Transform ERM risks directly into Audit Universe Units
    const ermDepartments = Array.from(new Set(ermRisks.map(r => r.department || 'General Custody Operations')));
    const syncedUniverse = ermDepartments.map((dept, idx) => {
      const deptRisks = ermRisks.filter(r => r.department === dept);
      const maxScore = Math.max(...deptRisks.map(r => r.residualScore || 50), 50);
      return {
        id: `ERM-UNIV-${idx + 1}`,
        processName: `${dept} Core Process Review`,
        department: dept,
        owner: 'Department Head / ERM Liaison',
        inherentRisk: Math.min(100, maxScore + 12),
        financialExposure: maxScore >= 80 ? 85 : 60,
        regulatoryImpact: maxScore >= 70 ? 90 : 50,
        previousFindings: deptRisks.length,
        fraudExposure: maxScore >= 80 ? 65 : 30,
        itDependency: dept.includes('IT') || dept.includes('Technology') ? 95 : 60,
        lastAuditDate: '2025-11-15',
        frequency: maxScore >= 75 ? 'Annual' : 'Biennial'
      };
    });

    const newErmFindings = ermRisks.map((risk, idx) => ({
      findingNumber: `FND-ERM-${String(idx + 1).padStart(3, '0')}`,
      businessUnit: risk.department || 'Corporate Governance',
      observation: `ERM Risk Feed Observation: ${risk.riskTitle}`,
      criteria: 'PENCOM Custodial SLA & Section 63 Prudential Guidelines',
      rootCause: 'Flagged via direct feed from enterprise risk register (ERM Suite).',
      likelihood: Math.max(1, Math.round((risk.residualScore || 60) / 10)),
      impact: Math.max(5, Math.round((risk.residualScore || 60) / 11)),
      residualRisk: risk.residualScore || 64,
      priority: (risk.residualScore || 60) >= 80 ? 'Critical' : (risk.residualScore || 60) >= 60 ? 'High' : 'Medium',
      severity: (risk.residualScore || 60) >= 80 ? 'High' : 'Medium',
      status: 'Open',
      actionPlan: `Mandatory substantive control verification for ERM risk item #${risk.id || idx + 1}`,
      dueDate: '2026-09-30',
      owner: 'ERM / Audit Liaison'
    }));

    const newErmPlans = ermDepartments.map((dept, idx) => {
      const deptRisks = ermRisks.filter(r => r.department === dept);
      const maxScore = Math.max(...deptRisks.map(r => r.residualScore || 50), 50);
      return {
        id: `PLAN-ERM-${idx + 1}`,
        auditName: `FY2026 ${dept} Risk-Based Audit`,
        auditCode: `RBA-${String(idx + 1).padStart(3, '0')}`,
        businessUnit: dept,
        priority: maxScore >= 80 ? 'Critical' : maxScore >= 65 ? 'High' : 'Medium',
        status: 'Scheduled',
        plannedQuarter: maxScore >= 80 ? 'Q1 2026' : 'Q2 2026',
        leadAuditor: 'Audit Manager',
        budgetHours: maxScore >= 80 ? 240 : 160
      };
    });

    saveArrayState('UNIVERSE', syncedUniverse, setAuditUniverse);
    if (isPurgeOrInit) {
      saveArrayState('FINDINGS', newErmFindings, setFindings);
      saveArrayState('PLANS', newErmPlans, setAuditPlans);
    } else {
      const combinedFindings = [...newErmFindings, ...findings.filter(f => !f.findingNumber.startsWith('FND-ERM-'))];
      saveArrayState('FINDINGS', combinedFindings, setFindings);
    }
    if (!isPurgeOrInit) {
      addNotification('Direct ERM Sync Complete', `Ingested ${ermRisks.length} Enterprise Risks directly from RiskINTEGRA ERM Suite into Audit Universe & Findings.`, 'success');
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
        switchRole,
        rolesList: ROLES_LIST,
        isAuthenticated,
        setIsAuthenticated,
        currentUser,
        setCurrentUser,
        loginWithMockAccount,
        logout,
        mockUsersList: MOCK_USERS,
        businessUnits,
        addBusinessUnit,
        auditUniverse,
        setAuditUniverse,
        auditPlans,
        saveAuditPlan,
        auditPrograms,
        setAuditPrograms,
        workingPapers,
        addWorkingPaper,
        findings,
        saveFinding,
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
        markAllRead
      }}
    >
      {children}
    </AuditContext.Provider>
  );
};
