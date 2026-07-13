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
  ROLES_LIST
} from '../data/mockAuditData';

export const AuditContext = createContext();

export const AuditProvider = ({ children }) => {
  const [clientProfile, setClientProfile] = useState('Zenith Pension Custodian Limited');
  const [currency, setCurrency] = useState('NGN');
  const [currentRole, setCurrentRole] = useState(ROLES_LIST[0]); // Chief Audit Executive by default
  
  const [businessUnits, setBusinessUnits] = useState(INITIAL_BUSINESS_UNITS);
  const [auditUniverse, setAuditUniverse] = useState(INITIAL_AUDIT_UNIVERSE);
  const [auditPlans, setAuditPlans] = useState(INITIAL_ANNUAL_AUDIT_PLANS);
  const [auditPrograms, setAuditPrograms] = useState(INITIAL_AUDIT_PROGRAMS);
  const [workingPapers, setWorkingPapers] = useState(INITIAL_WORKING_PAPERS);
  const [findings, setFindings] = useState(INITIAL_FINDINGS);
  const [controls, setControls] = useState(INITIAL_INTERNAL_CONTROLS);
  const [regulatoryReviews, setRegulatoryReviews] = useState(INITIAL_REGULATORY_REVIEWS);
  const [fraudCases, setFraudCases] = useState(INITIAL_FRAUD_CASES);
  const [continuousExceptions, setContinuousExceptions] = useState(INITIAL_CONTINUOUS_EXCEPTIONS);

  // Risk-based audit planning weights
  const [scoringWeights, setScoringWeights] = useState({
    inherentRisk: 25,
    financialExposure: 20,
    regulatoryImpact: 20,
    previousFindings: 15,
    fraudExposure: 10,
    itDependency: 10
  });

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

  // Mark all notifications read
  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Calculate overall audit priority from weights
  const calculateOverallScore = (unit) => {
    const { inherentRisk, financialExposure, regulatoryImpact, previousFindings, fraudExposure, itDependency } = scoringWeights;
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
        scoringWeights,
        setScoringWeights,
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
