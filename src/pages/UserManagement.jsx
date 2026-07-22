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
  }
];

const INITIAL_AUDIT_USERS = [
  {
    id: 'usr-aud-001',
    employeeId: 'ZPC-AUD-001',
    name: 'Dr. Chidi Nnamdi',
    email: 'c.nnamdi@zenithpensions.com',
    role: 'Chief_Audit_Executive',
    roleName: 'Chief Audit Executive (CAE)',
    department: 'Internal Audit & Governance',
    auditScope: 'All Institutional Operations & Custody',
    status: 'Active',
    lastLogin: '2026-07-22 15:40:12',
    twoFactorEnabled: true
  },
  {
    id: 'usr-aud-002',
    employeeId: 'ZPC-AUD-002',
    name: 'Aminu Bello',
    email: 'a.bello@zenithpensions.com',
    role: 'Audit_Manager',
    roleName: 'Audit Manager / Lead Auditor',
    department: 'Financial & Custodial Audit',
    auditScope: 'Custodial Settlements & Fund Accounting',
    status: 'Active',
    lastLogin: '2026-07-22 14:12:05',
    twoFactorEnabled: true
  },
  {
    id: 'usr-aud-003',
    employeeId: 'ZPC-AUD-003',
    name: 'Nkechi Okonkwo',
    email: 'n.okonkwo@zenithpensions.com',
    role: 'Senior_Auditor',
    roleName: 'Senior Internal Auditor',
    department: 'Compliance & Regulatory Audit',
    auditScope: 'PENCOM Regulatory Compliance & Licensing',
    status: 'Active',
    lastLogin: '2026-07-21 09:30:44',
    twoFactorEnabled: true
  },
  {
    id: 'usr-aud-004',
    employeeId: 'ZPC-AUD-004',
    name: 'Tunde Bakare',
    email: 't.bakare@zenithpensions.com',
    role: 'IT_Audit_Specialist',
    roleName: 'IT & Cybersecurity Auditor',
    department: 'Information Technology Audit',
    auditScope: 'Core Custody Infrastructure & Cyber Controls',
    status: 'Active',
    lastLogin: '2026-07-22 16:05:11',
    twoFactorEnabled: true
  },
  {
    id: 'usr-aud-005',
    employeeId: 'ZPC-AUD-005',
    name: 'Fatima Yar’Adua',
    email: 'f.yaradua@zenithpensions.com',
    role: 'Forensic_Specialist',
    roleName: 'Forensic & Fraud Specialist',
    department: 'Forensic Investigations',
    auditScope: 'High-Value Transfer Ledgers & Fraud Prevention',
    status: 'Active',
    lastLogin: '2026-07-20 11:22:19',
    twoFactorEnabled: true
  },
  {
    id: 'usr-aud-006',
    employeeId: 'ZPC-AUD-006',
    name: 'Chief Olumide Adeleke',
    email: 'o.adeleke@board.zenithpensions.com',
    role: 'Audit_Committee_Member',
    roleName: 'Audit Committee Member',
    department: 'Board Audit Committee',
    auditScope: 'Board Oversight & Independence Telemetry',
    status: 'Active',
    lastLogin: '2026-07-19 17:45:00',
    twoFactorEnabled: true
  }
];

const INITIAL_AUDIT_LOGS = [
  {
    id: 'log-001',
    timestamp: '2026-07-22 15:40:12',
    actor: 'Dr. Chidi Nnamdi (CAE)',
    action: 'USER_PROVISIONED',
    target: 'Tunde Bakare (ZPC-AUD-004)',
    details: 'Provisioned IT & Cybersecurity Auditor profile with active 2FA.'
  },
  {
    id: 'log-002',
    timestamp: '2026-07-21 11:15:00',
    actor: 'Dr. Chidi Nnamdi (CAE)',
    action: 'ROLE_MODIFIED',
    target: 'Aminu Bello (ZPC-AUD-002)',
    details: 'Elevated role to Audit Manager / Lead Auditor for FY2026 Annual Audit Plan.'
  }
];

export const UserManagement = () => {
  const { addToast } = useContext(AuditContext);
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('zpc_audit_users');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_USERS;
  });

  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('zpc_audit_user_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

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
    status: 'Active'
  });

  useEffect(() => {
    localStorage.setItem('zpc_audit_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('zpc_audit_user_logs', JSON.stringify(logs));
  }, [logs]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
      const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      employeeId: `ZPC-AUD-${String(users.length + 1).padStart(3, '0')}`,
      role: 'Senior_Auditor',
      department: 'Internal Audit & Governance',
      auditScope: 'Custodial & Financial Operations',
      status: 'Active'
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      employeeId: user.employeeId,
      role: user.role,
      department: user.department,
      auditScope: user.auditScope,
      status: user.status
    });
    setShowModal(true);
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      if (addToast) addToast('⚠️ Please fill out all required fields.', 'warning');
      return;
    }

    const selectedRole = AUDIT_RBAC_ROLES.find(r => r.id === formData.role) || AUDIT_RBAC_ROLES[2];

    if (editingUser) {
      const updated = users.map(u => u.id === editingUser.id ? {
        ...u,
        ...formData,
        roleName: selectedRole.name
      } : u);
      setUsers(updated);

      const newLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actor: 'Chief Audit Executive (CAE)',
        action: 'PROFILE_UPDATED',
        target: `${formData.name} (${formData.employeeId})`,
        details: `Updated role to ${selectedRole.name} and scope to "${formData.auditScope}".`
      };
      setLogs([newLog, ...logs]);

      if (addToast) addToast(`✓ Successfully updated Audit profile for ${formData.name}`, 'success');
    } else {
      const newUser = {
        id: `usr-aud-${Date.now()}`,
        ...formData,
        roleName: selectedRole.name,
        lastLogin: 'Never',
        twoFactorEnabled: true
      };
      setUsers([newUser, ...users]);

      const newLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actor: 'Chief Audit Executive (CAE)',
        action: 'USER_PROVISIONED',
        target: `${formData.name} (${formData.employeeId})`,
        details: `Provisioned 3LoD Audit Credentials as ${selectedRole.name}.`
      };
      setLogs([newLog, ...logs]);

      if (addToast) addToast(`👤 Provisioned new Audit credentials for ${formData.name}`, 'success');
    }

    setShowModal(false);
  };

  const handleToggleStatus = (targetId) => {
    const target = users.find(u => u.id === targetId);
    if (!target) return;
    const newStatus = target.status === 'Active' ? 'Suspended' : 'Active';
    const updated = users.map(u => u.id === targetId ? { ...u, status: newStatus } : u);
    setUsers(updated);

    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: 'Chief Audit Executive (CAE)',
      action: 'STATUS_TOGGLED',
      target: `${target.name} (${target.employeeId})`,
      details: `Account access state transitioned to: ${newStatus}.`
    };
    setLogs([newLog, ...logs]);

    if (addToast) addToast(`🛡️ User ${target.name} status updated to ${newStatus}`, newStatus === 'Active' ? 'success' : 'warning');
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
                Audit Personnel & RBAC Governance
              </h1>
              <p style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '0.85rem', margin: 0, fontWeight: 500 }}>
                3rd Line Independent Assurance User Management & Privilege Enforcement — PENCOM Compliant
              </p>
            </div>
          </div>
        </div>

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
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>100%</div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>2FA Enforced Security</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '1.5rem'
      }}>
        <button
          onClick={() => setActiveTab('personnel')}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'personnel' ? '3px solid #f472b6' : '3px solid transparent',
            color: activeTab === 'personnel' ? '#f472b6' : '#94a3b8',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          👤 Audit Roster & Personnel
        </button>

        <button
          onClick={() => setActiveTab('rbac')}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'rbac' ? '3px solid #f472b6' : '3px solid transparent',
            color: activeTab === 'rbac' ? '#f472b6' : '#94a3b8',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          🔐 Audit RBAC Permission Matrix
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'logs' ? '3px solid #f472b6' : '3px solid transparent',
            color: activeTab === 'logs' ? '#f472b6' : '#94a3b8',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          📜 Access & Privilege Audit Logs
        </button>
      </div>

      {/* TAB 1: AUDIT PERSONNEL ROSTER */}
      {activeTab === 'personnel' && (
        <div>
          {/* Controls & Search */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '1.25rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search audit personnel by name, email, or employee ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 1rem 0.6rem 2.4rem',
                  borderRadius: '8px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: 'white',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                style={{
                  padding: '0.6rem 1rem',
                  borderRadius: '8px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: 'white',
                  fontSize: '0.85rem'
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
                  padding: '0.6rem 1rem',
                  borderRadius: '8px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: 'white',
                  fontSize: '0.85rem'
                }}
              >
                <option value="ALL">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Personnel Table */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
                  <th style={{ padding: '1rem 1.2rem' }}>Personnel</th>
                  <th style={{ padding: '1rem 1.2rem' }}>Audit Role</th>
                  <th style={{ padding: '1rem 1.2rem' }}>Assigned Department / Scope</th>
                  <th style={{ padding: '1rem 1.2rem' }}>2FA Security</th>
                  <th style={{ padding: '1rem 1.2rem' }}>Status</th>
                  <th style={{ padding: '1rem 1.2rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                      No audit personnel matching search filters.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u, idx) => {
                    const roleBadge = AUDIT_RBAC_ROLES.find(r => r.id === u.role)?.badge || { bg: 'rgba(99,102,241,0.18)', border: 'rgba(99,102,241,0.4)', text: '#818CF8' };
                    return (
                      <tr key={u.id} style={{ borderBottom: idx === filteredUsers.length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.05)', transition: 'background 0.2s' }}>
                        <td style={{ padding: '1rem 1.2rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #ec4899, #be185d)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: '0.8rem',
                              color: 'white',
                              boxShadow: '0 0 8px rgba(236, 72, 153, 0.4)'
                            }}>
                              {u.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: 'white' }}>{u.name}</div>
                              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{u.email} · <span style={{ color: '#f472b6', fontWeight: 600 }}>{u.employeeId}</span></div>
                            </div>
                          </div>
                        </td>

                        <td style={{ padding: '1rem 1.2rem' }}>
                          <span style={{
                            padding: '0.25rem 0.6rem',
                            borderRadius: '2rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            background: roleBadge.bg,
                            border: `1px solid ${roleBadge.border}`,
                            color: roleBadge.text,
                            display: 'inline-block'
                          }}>
                            {u.roleName || u.role}
                          </span>
                        </td>

                        <td style={{ padding: '1rem 1.2rem', maxWidth: '240px' }}>
                          <div style={{ color: '#e2e8f0', fontWeight: 600 }}>{u.department}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.auditScope}</div>
                        </td>

                        <td style={{ padding: '1rem 1.2rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#34d399', fontSize: '0.78rem', fontWeight: 600 }}>
                            <Shield size={14} /> Enforced (TOTP)
                          </span>
                        </td>

                        <td style={{ padding: '1rem 1.2rem' }}>
                          <span style={{
                            padding: '0.2rem 0.55rem',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            background: u.status === 'Active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            border: `1px solid ${u.status === 'Active' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                            color: u.status === 'Active' ? '#34d399' : '#f87171'
                          }}>
                            {u.status}
                          </span>
                        </td>

                        <td style={{ padding: '1rem 1.2rem', textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleOpenEditModal(u)}
                              style={{
                                background: 'rgba(255, 255, 255, 0.06)',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                color: '#e2e8f0',
                                padding: '0.3rem 0.6rem',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                fontWeight: 600
                              }}
                            >
                              Edit Profile
                            </button>

                            <button
                              onClick={() => handleToggleStatus(u.id)}
                              style={{
                                background: u.status === 'Active' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                border: `1px solid ${u.status === 'Active' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
                                color: u.status === 'Active' ? '#f87171' : '#34d399',
                                padding: '0.3rem 0.6rem',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                fontWeight: 700
                              }}
                            >
                              {u.status === 'Active' ? 'Suspend' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: AUDIT RBAC PERMISSION MATRIX */}
      {activeTab === 'rbac' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {AUDIT_RBAC_ROLES.map(role => (
            <div key={role.id} style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: `1px solid ${role.badge.border}`,
              borderRadius: '12px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{
                    padding: '0.25rem 0.65rem',
                    borderRadius: '2rem',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    background: role.badge.bg,
                    border: `1px solid ${role.badge.border}`,
                    color: role.badge.text
                  }}>
                    {role.level}
                  </span>
                  <Shield size={18} style={{ color: role.badge.text }} />
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.4rem 0', color: 'white' }}>
                  {role.name}
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '1.2rem' }}>
                  {role.description}
                </p>

                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f472b6', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                    Granted 3LoD Privileges:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {role.permissions.map((p, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#e2e8f0' }}>
                        <CheckCircle size={14} style={{ color: '#34d399', flexShrink: 0 }} />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', marginTop: '1.5rem', paddingTop: '0.75rem', fontSize: '0.75rem', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                <span>PENCOM Governance Model</span>
                <span style={{ color: role.badge.text, fontWeight: 700 }}>Independent 3LoD</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>WORM Immutable Audit Logs</h3>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>Audit personnel privilege assignments & credential lifecycle history</p>
            </div>
            <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '0.3rem 0.75rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 700, border: '1px solid rgba(16, 185, 129, 0.4)' }}>
              🔒 WORM Sealed
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
              {logs.map((l, i) => (
                <tr key={l.id || i} style={{ borderBottom: i === logs.length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.05)' }}>
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
              ))}
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
