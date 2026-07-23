import React, { useContext, useState, useMemo, useEffect } from 'react';
import { AuditContext } from '../context/AuditContext';
import { Shield, UserPlus, Search, Filter, Lock, CheckCircle, XCircle, AlertTriangle, Key, Award, UserCheck, RefreshCw, FileText, ChevronRight } from 'lucide-react';

const API_BASE_URL = (import.meta.env.VITE_AWS_API_URL || 'https://uhzosq0g0i.execute-api.eu-west-1.amazonaws.com/prod/').replace(/\/$/, '');

const AUDIT_RBAC_ROLES = [
  {
    id: 'Chief_Audit_Executive',
    name: 'Chief Audit Executive (CAE)',
    description: '3rd Line Governance Leader. Overall Audit Plan approval, Board Audit Committee reporting, and independent sign-off.',
    badge: { bg: 'rgba(236, 72, 153, 0.18)', border: 'rgba(236, 72, 153, 0.4)', text: '#F472B6' },
    level: 'Tier 1 — Strategic',
    permissions: ['Annual Plan Sign-off', 'Board Committee Reporting', 'Audit Universe Management', 'Role Assignment']
  },
  {
    id: 'Audit_Manager',
    name: 'Audit Manager / Lead Auditor',
    description: 'Leads audit engagements, reviews working papers, approves audit findings, and manages field teams.',
    badge: { bg: 'rgba(99, 102, 241, 0.18)', border: 'rgba(99, 102, 241, 0.4)', text: '#818CF8' },
    level: 'Tier 2 — Tactical Lead',
    permissions: ['Engagement Lead', 'Working Paper Review', 'Finding Approval', 'Audit Program Execution']
  },
  {
    id: 'Senior_Auditor',
    name: 'Senior Internal Auditor',
    description: 'Conducts complex audit testing, draft audit observations, sample validation, and control assessments.',
    badge: { bg: 'rgba(139, 92, 246, 0.18)', border: 'rgba(139, 92, 246, 0.4)', text: '#A78BFA' },
    level: 'Tier 3 — Field Execution',
    permissions: ['Fieldwork Testing', 'Working Paper Upload', 'Draft Finding Logging', 'Sample Testing']
  },
  {
    id: 'IT_Audit_Specialist',
    name: 'IT & Cybersecurity Auditor',
    description: 'Specialized technology risk audits, IT general controls (ITGC), automated exception rule design.',
    badge: { bg: 'rgba(20, 184, 166, 0.18)', border: 'rgba(20, 184, 166, 0.4)', text: '#2DD4BF' },
    level: 'Tier 3 — Technical Specialist',
    permissions: ['ITGC Testing', 'Automated Exception Rule Config', 'System Telemetry Audit', 'Cyber Risk Assessment']
  },
  {
    id: 'Forensic_Specialist',
    name: 'Forensic & Fraud Specialist',
    description: 'Investigates financial anomalies, fraud cases, whistleblower reports, and continuous transaction monitoring.',
    badge: { bg: 'rgba(239, 68, 68, 0.18)', border: 'rgba(239, 68, 68, 0.4)', text: '#F87171' },
    level: 'Tier 3 — Forensic Specialist',
    permissions: ['Fraud Ledger Access', 'Continuous Monitoring Rules', 'Whistleblower Case File', 'Investigation Sign-off']
  },
  {
    id: 'Audit_Committee_Member',
    name: 'Audit Committee Member',
    description: 'Non-executive oversight access to audit findings, annual plan progress, and independence telemetry.',
    badge: { bg: 'rgba(245, 158, 11, 0.18)', border: 'rgba(245, 158, 11, 0.4)', text: '#FBBF24' },
    level: 'Tier 1 — Board Oversight',
    permissions: ['Read-Only Audit Reports', 'Board Dashboard View', 'Findings Progress Tracking', 'Committee Briefings']
  },
  {
    id: 'External_Auditor',
    name: 'External Auditor (Regulatory/Independent)',
    description: 'Limited read-only engagement access for PENCOM external examiners and independent financial auditors.',
    badge: { bg: 'rgba(100, 116, 139, 0.18)', border: 'rgba(100, 116, 139, 0.4)', text: '#94A3B8' },
    level: 'Tier 4 — External Access',
    permissions: ['Scoped Working Paper View', 'Attestation Repository', 'Regulatory Submissions View']
  },
  {
    id: 'admin',
    name: 'System Administrator (Platform Admin)',
    description: 'Full administrative access across ERM & Audit suites, system provisioning, and security policy management.',
    badge: { bg: 'rgba(239, 68, 68, 0.25)', border: 'rgba(239, 68, 68, 0.5)', text: '#EF4444' },
    level: 'Tier 0 — Platform Admin',
    permissions: ['Full Platform Admin', 'User Provisioning', 'Audit Trail Export', 'Security Matrix Config']
  }
];

const AUDIT_ROLE_IDS = [
  'Chief_Audit_Executive',
  'Audit_Manager',
  'Senior_Auditor',
  'IT_Audit_Specialist',
  'Forensic_Specialist',
  'Audit_Committee_Member',
  'External_Auditor',
  'admin',
  'Platform_Administrator',
  'Security_Administrator'
];

export const UserManagement = () => {
  const { addToast, auditLogs, logAuditAction } = useContext(AuditContext);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [logs, setLogs] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState('personnel'); // 'personnel' | 'rbac' | 'logs'
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    employeeId: '',
    role: 'Senior_Auditor',
    department: 'Internal Audit & Governance',
    auditScope: 'Operational Risk & Compliance',
    appScope: 'audit',
    status: 'Active'
  });

  const fetchUsersFromCognito = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/users`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          // Filter to Audit roles + Admin roles, or users with appScope === 'audit'
          const auditUsers = data.filter(u => 
            AUDIT_ROLE_IDS.includes(u.role) || 
            AUDIT_ROLE_IDS.includes(u.auditRole) || 
            u.appScope === 'audit' ||
            u.appScope === 'both'
          );
          setUsers(auditUsers);
        }
      }
    } catch (e) {
      console.error("Failed fetching audit users from directory API:", e);
      if (addToast) addToast("⚠️ Could not load remote user directory", "warning");
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsersFromCognito();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = 
        (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.employeeId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.department || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'ALL' || u.role === roleFilter || u.auditRole === roleFilter;
      const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '@zenithpensions.com',
      employeeId: `ZPC-AUD-${Math.floor(100 + Math.random() * 900)}`,
      role: 'Senior_Auditor',
      department: 'Internal Audit & Governance',
      auditScope: 'Custodial & Financial Operations',
      appScope: 'audit',
      status: 'Active'
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      employeeId: user.employeeId || '',
      role: user.auditRole || user.role || 'Senior_Auditor',
      department: user.department || 'Internal Audit & Governance',
      auditScope: user.auditScope || 'Custodial & Financial Operations',
      appScope: user.appScope || 'audit',
      status: user.status || 'Active'
    });
    setShowModal(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      if (addToast) addToast('⚠️ Please fill out all required fields.', 'warning');
      return;
    }

    const selectedRole = AUDIT_RBAC_ROLES.find(r => r.id === formData.role) || AUDIT_RBAC_ROLES[2];
    const payload = {
      ...formData,
      auditRole: formData.role,
      roleName: selectedRole.name
    };

    if (editingUser) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/users/${encodeURIComponent(formData.email)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to update user');
        }
      } catch (err) {
        console.error("Failed updating user via API Gateway:", err);
        if (addToast) addToast(`🚨 API Error: ${err.message}`, 'danger');
        return;
      }

      setUsers(users.map(u => u.id === editingUser.id || u.email === formData.email ? { ...u, ...payload } : u));
      if (addToast) addToast(`✓ Successfully updated Audit profile for ${formData.name}`, 'success');
      if (logAuditAction) logAuditAction('UPDATE_AUDIT_USER', 'User', formData.email, `Updated Audit profile for ${formData.name} (${formData.role})`);
    } else {
      try {
        const res = await fetch(`${API_BASE_URL}/api/users/provision`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to provision user');
      } catch (err) {
        console.error("Failed provisioning user via API Gateway:", err);
        if (addToast) addToast(`🚨 API Error: ${err.message}`, 'danger');
        return;
      }

      const newUser = {
        id: `usr-aud-${Date.now()}`,
        ...payload,
        twoFactorEnabled: true
      };
      setUsers([newUser, ...users]);
      if (addToast) addToast(`👤 Provisioned new Audit credentials for ${formData.name}`, 'success');
      if (logAuditAction) logAuditAction('PROVISION_AUDIT_USER', 'User', formData.email, `Provisioned new Audit credentials for ${formData.name} (${formData.role})`);
    }

    setShowModal(false);
  };

  const handleToggleStatus = async (targetUser) => {
    if (!targetUser) return;
    const newStatus = targetUser.status === 'Active' ? 'Suspended' : 'Active';
    const updatedUser = { ...targetUser, status: newStatus };

    try {
      await fetch(`${API_BASE_URL}/api/users/${encodeURIComponent(targetUser.email)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      });
      setUsers(users.map(u => u.email === targetUser.email ? updatedUser : u));
      if (addToast) addToast(`🛡️ Account status updated for ${targetUser.name}: ${newStatus}`, newStatus === 'Active' ? 'success' : 'warning');
      if (logAuditAction) logAuditAction('USER_STATUS_CHANGE', 'User', targetUser.email, `Account status updated for ${targetUser.name} to ${newStatus}`);
    } catch (e) {
      console.error("Failed toggling status:", e);
    }
  };

  return (
    <div style={{ padding: '2rem 2.5rem', minHeight: '100vh', background: 'var(--bg-dark, #0a0f1d)', color: 'white' }}>
      
      {/* Header Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(159, 18, 57, 0.4))',
              border: '1px solid rgba(236, 72, 153, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f472b6',
              boxShadow: '0 0 15px rgba(236, 72, 153, 0.2)'
            }}>
              <Shield size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>
                User Management
              </h1>
              <p style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '0.85rem', margin: 0, fontWeight: 500 }}>
                Independent Audit & Assurance User Management & Privilege Enforcement — PENCOM Compliant
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            onClick={fetchUsersFromCognito}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'white',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <RefreshCw size={14} className={loadingUsers ? 'animate-spin' : ''} />
            Sync Directory
          </button>

          <button
            onClick={handleOpenAddModal}
            style={{
              padding: '0.65rem 1.2rem',
              borderRadius: '8px',
              border: '1px solid rgba(236, 72, 153, 0.45)',
              background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.25) 0%, rgba(159, 18, 57, 0.35) 100%)',
              color: 'white',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 0 12px rgba(236, 72, 153, 0.3)',
              transition: 'all 0.2s'
            }}
          >
            <UserPlus size={16} />
            Provision Audit Personnel
          </button>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem', marginBottom: '2rem' }}>
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{ padding: '0.75rem', borderRadius: '10px', background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6' }}>
            <UserCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{users.length}</div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Total Audit Personnel</div>
          </div>
        </div>

        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{ padding: '0.75rem', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{users.filter(u => u.status === 'Active').length}</div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Active License Credentials</div>
          </div>
        </div>

        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{ padding: '0.75rem', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{AUDIT_RBAC_ROLES.length}</div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Defined 3LoD RBAC Roles</div>
          </div>
        </div>

        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{ padding: '0.75rem', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <Lock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{auditLogs ? auditLogs.length : 0} Events</div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Immutable Security Logs</div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '1.5rem' }}>
        {[
          { id: 'personnel', label: 'Audit Directory & Roster', icon: UserCheck },
          { id: 'rbac', label: '3LoD Permission Matrix & Roles', icon: Key },
          { id: 'logs', label: 'Security & Access Logs', icon: FileText }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.75rem 1.25rem',
                border: 'none',
                borderBottom: isActive ? '2px solid #f472b6' : '2px solid transparent',
                background: 'transparent',
                color: isActive ? '#f472b6' : '#94a3b8',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s'
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: PERSONNEL DIRECTORY */}
      {activeTab === 'personnel' && (
        <>
          {/* Controls Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            background: 'rgba(15, 23, 42, 0.4)',
            padding: '1rem',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
              <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search personnel by name, email, employee ID or department..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem 0.65rem 2.6rem',
                  borderRadius: '8px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: 'white',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                style={{
                  padding: '0.65rem 1rem',
                  borderRadius: '8px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: 'white',
                  fontSize: '0.82rem'
                }}
              >
                <option value="ALL">All Audit Roles</option>
                {AUDIT_RBAC_ROLES.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                style={{
                  padding: '0.65rem 1rem',
                  borderRadius: '8px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: 'white',
                  fontSize: '0.82rem'
                }}
              >
                <option value="ALL">All Statuses</option>
                <option value="Active">Active Credentials</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* User Cards / Roster Grid */}
          {loadingUsers ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
              <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 1rem' }} />
              Loading Cognito User Pool Users...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
              <Shield size={32} style={{ color: '#f472b6', marginBottom: '0.5rem' }} />
              <h4 style={{ margin: '0 0 0.25rem 0', color: 'white' }}>No Audit Personnel Found</h4>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>Try resetting your search query or role filter.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {filteredUsers.map(user => {
                const roleObj = AUDIT_RBAC_ROLES.find(r => r.id === (user.auditRole || user.role)) || AUDIT_RBAC_ROLES[2];
                const isSuspended = user.status === 'Suspended';

                return (
                  <div
                    key={user.id || user.email}
                    style={{
                      background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '14px',
                      padding: '1.4rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                      opacity: isSuspended ? 0.7 : 1
                    }}
                  >
                    <div>
                      {/* Top Header Card Info */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                        <div>
                          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'white' }}>
                            {user.name}
                          </h3>
                          <div style={{ fontSize: '0.78rem', color: '#f472b6', fontWeight: 600, fontFamily: 'monospace' }}>
                            {user.employeeId || user.email}
                          </div>
                        </div>

                        <span style={{
                          padding: '0.2rem 0.6rem',
                          borderRadius: '9999px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          background: isSuspended ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          color: isSuspended ? '#f87171' : '#34d399',
                          border: isSuspended ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)'
                        }}>
                          {user.status || 'Active'}
                        </span>
                      </div>

                      {/* Role Pill */}
                      <div style={{ marginBottom: '1rem' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '0.3rem 0.75rem',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: roleObj.badge.bg,
                          color: roleObj.badge.text,
                          border: `1px solid ${roleObj.badge.border}`
                        }}>
                          {roleObj.name}
                        </span>
                      </div>

                      {/* Details Meta */}
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.25rem' }}>
                        <div><strong>Dept:</strong> {user.department || 'Internal Audit & Governance'}</div>
                        <div><strong>Email:</strong> {user.email}</div>
                        <div><strong>Scope:</strong> {user.auditScope || 'Custodial & Regulatory Compliance'}</div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '0.85rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                    }}>
                      <button
                        onClick={() => handleToggleStatus(user)}
                        style={{
                          padding: '0.4rem 0.8rem',
                          borderRadius: '6px',
                          border: 'none',
                          background: isSuspended ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: isSuspended ? '#34d399' : '#f87171',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {isSuspended ? 'Reactivate' : 'Suspend'}
                      </button>

                      <button
                        onClick={() => handleOpenEditModal(user)}
                        style={{
                          padding: '0.4rem 0.8rem',
                          borderRadius: '6px',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          background: 'rgba(255, 255, 255, 0.05)',
                          color: 'white',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Edit Profile
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* TAB 2: 3LOD PERMISSION MATRIX & ROLES */}
      {activeTab === 'rbac' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {AUDIT_RBAC_ROLES.map(role => (
            <div
              key={role.id}
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: role.badge.text,
                    background: role.badge.bg,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    border: `1px solid ${role.badge.border}`
                  }}>
                    {role.level}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                    {role.id}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'white' }}>
                  {role.name}
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 1.25rem 0', lineHeight: 1.5 }}>
                  {role.description}
                </p>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.5rem' }}>
                    Granted Privilege Scope:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {role.permissions.map((p, idx) => (
                      <span key={idx} style={{
                        fontSize: '0.72rem',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        color: '#cbd5e1'
                      }}>
                        ✓ {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{
                fontSize: '0.75rem',
                color: '#94a3b8',
                paddingTop: '0.75rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span>Assigned Users:</span>
                <span style={{ fontWeight: 700, color: role.badge.text }}>
                  {users.filter(u => (u.auditRole || u.role) === role.id).length} Personnel
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: SECURITY & ACCESS LOGS */}
      {activeTab === 'logs' && (
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>Audit Credentials Security Telemetry</h3>
            <span style={{ fontSize: '0.75rem', color: '#34d399', background: 'rgba(16, 185, 129, 0.15)', padding: '0.25rem 0.6rem', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              🔒 WORM Sealed Audit Trail
            </span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
                <th style={{ padding: '0.85rem 1.2rem' }}>Timestamp</th>
                <th style={{ padding: '0.85rem 1.2rem' }}>Actor</th>
                <th style={{ padding: '0.85rem 1.2rem' }}>Action</th>
                <th style={{ padding: '0.85rem 1.2rem' }}>Target Personnel</th>
                <th style={{ padding: '0.85rem 1.2rem' }}>Audit Trail Details</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const displayLogs = (auditLogs && auditLogs.length > 0) ? auditLogs : logs;
                if (displayLogs.length === 0) {
                  return (
                    <tr>
                      <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                        No security events logged in this session.
                      </td>
                    </tr>
                  );
                }
                return displayLogs.map((l, i) => (
                  <tr key={l.id || i} style={{ borderBottom: i === displayLogs.length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '0.85rem 1.2rem', color: '#94a3b8', fontFamily: 'monospace' }}>{l.timestamp}</td>
                    <td style={{ padding: '0.85rem 1.2rem', fontWeight: 700, color: 'white' }}>{l.actor}</td>
                    <td style={{ padding: '0.85rem 1.2rem' }}>
                      <span style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, border: '1px solid rgba(236, 72, 153, 0.3)' }}>
                        {l.action}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1.2rem', color: '#e2e8f0', fontWeight: 600 }}>{l.target}</td>
                    <td style={{ padding: '0.85rem 1.2rem', color: '#94a3b8' }}>{l.details}</td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>
      )}

      {/* PROVISION / EDIT AUDIT USER MODAL */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: '#0f172a',
            border: '1px solid rgba(236, 72, 153, 0.4)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '520px',
            padding: '2rem',
            boxShadow: '0 25px 50px rgba(0,0,0,0.7)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Shield size={20} style={{ color: '#f472b6' }} />
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
                  {editingUser ? 'Edit Audit Personnel Profile' : 'Provision New Audit Credentials'}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUser} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Chidi Nnamdi"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: 'white',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, marginBottom: '0.4rem' }}>
                    Corporate Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="c.nnamdi@zenithpensions.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      background: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: 'white',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, marginBottom: '0.4rem' }}>
                    Employee ID
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={formData.employeeId}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#f472b6',
                      fontWeight: 700,
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Assigned Audit Role *
                </label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(236, 72, 153, 0.4)',
                    color: 'white',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}
                >
                  {AUDIT_RBAC_ROLES.map(r => (
                    <option key={r.id} value={r.id}>{r.name} ({r.level})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Department Unit
                </label>
                <input
                  type="text"
                  placeholder="e.g. Financial & Custodial Audit"
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: 'white',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Assigned Audit Scope / Mandate
                </label>
                <input
                  type="text"
                  placeholder="e.g. Custodial Settlements & Fund Accounting"
                  value={formData.auditScope}
                  onChange={e => setFormData({ ...formData, auditScope: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: 'white',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '0.65rem 1.2rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    background: 'transparent',
                    color: '#94a3b8',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    padding: '0.65rem 1.4rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
                    color: 'white',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 0 12px rgba(236, 72, 153, 0.4)'
                  }}
                >
                  {editingUser ? 'Save Profile Changes' : 'Provision Audit Personnel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
