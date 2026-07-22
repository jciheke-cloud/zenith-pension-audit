import React, { useState, useContext } from 'react';
import { AuditContext } from '../context/AuditContext';
import { Users, UserPlus, Shield, Trash2, CheckCircle2, Lock, Mail, Building } from 'lucide-react';

const AuditUserManagementModal = ({ isOpen, onClose }) => {
  const { addNotification, logAuditAction, currentUser, currentRole } = useContext(AuditContext);

  // In-memory Audit users list
  const [auditUsers, setAuditUsers] = useState([
    { id: 'usr-aud-1', name: 'Lead CAE', email: 'cae@zenithpension.com', role: 'Chief Audit Executive (CAE)', department: 'Internal Audit & Governance', status: 'Active', lastActive: 'Today' },
    { id: 'usr-aud-2', name: 'Audit Manager', email: 'auditmanager@zenithpension.com', role: 'Audit Manager', department: 'Internal Audit & Governance', status: 'Active', lastActive: 'Yesterday' },
    { id: 'usr-aud-3', name: 'Senior IT Auditor', email: 'itauditor@zenithpension.com', role: 'Senior Auditor', department: 'Internal Audit & Governance', status: 'Active', lastActive: '3 days ago' },
    { id: 'usr-aud-4', name: 'QA Auditor', email: 'qaauditor@zenithpension.com', role: 'QA Auditor', department: 'Internal Audit & Governance', status: 'Active', lastActive: '1 week ago' },
  ]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Senior Auditor');

  if (!isOpen) return null;

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!name || !email) return;

    const newUser = {
      id: `usr-aud-${Date.now()}`,
      name,
      email,
      role,
      department: 'Internal Audit & Governance',
      status: 'Active',
      lastActive: 'Just now'
    };

    setAuditUsers(prev => [newUser, ...prev]);
    addNotification('Audit User Provisioned', `New Internal Audit personnel "${name}" (${role}) provisioned.`, 'success');
    logAuditAction('PROVISION_AUDIT_USER', 'User Management', `Chief Auditor provisioned account for ${name} (${email})`);

    setName('');
    setEmail('');
    setRole('Senior Auditor');
  };

  const handleDeleteUser = (id, userName) => {
    if (!window.confirm(`Are you sure you want to revoke audit portal access for "${userName}"?`)) return;
    setAuditUsers(prev => prev.filter(u => u.id !== id));
    addNotification('Access Revoked', `Internal Audit portal access revoked for "${userName}".`, 'warning');
    logAuditAction('REVOKE_AUDIT_USER', 'User Management', `Chief Auditor revoked account for ${userName}`);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.98), rgba(17, 24, 39, 0.95))',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        borderRadius: '16px',
        width: '92%',
        maxWidth: '850px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
        color: '#f8fafc'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.1) 0%, transparent 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34d399'
            }}>
              <Users size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                Internal Audit Team User Management
              </h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>
                Department-segregated personnel provisioning & RBAC entitlement controls
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: '1.25rem',
              cursor: 'pointer',
              padding: '0.25rem 0.5rem'
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem 1.75rem' }}>
          {/* Add User Form */}
          <form onSubmit={handleAddUser} style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '12px',
            padding: '1.25rem',
            marginBottom: '1.5rem'
          }}>
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserPlus size={16} />
              <span>Provision New Audit Team Member</span>
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.35rem' }}>Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Samuel Okon" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '0.85rem'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.35rem' }}>Official Email</label>
                <input 
                  type="email" 
                  placeholder="name@zenithpension.com" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '0.85rem'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.35rem' }}>Audit Role</label>
                <select 
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '0.85rem'
                  }}
                >
                  <option value="Chief Audit Executive (CAE)">Chief Audit Executive (CAE)</option>
                  <option value="Audit Manager">Audit Manager</option>
                  <option value="Senior Auditor">Senior Auditor</option>
                  <option value="QA Auditor">QA Auditor</option>
                </select>
              </div>

              <button 
                type="submit" 
                style={{
                  padding: '0.55rem 1.25rem',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                Provision User
              </button>
            </div>
          </form>

          {/* Audit Users Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8' }}>
                  <th style={{ padding: '0.75rem' }}>Name</th>
                  <th style={{ padding: '0.75rem' }}>Email</th>
                  <th style={{ padding: '0.75rem' }}>Role</th>
                  <th style={{ padding: '0.75rem' }}>Department Scope</th>
                  <th style={{ padding: '0.75rem' }}>Status</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {auditUsers.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 600, color: 'white' }}>{user.name}</td>
                    <td style={{ padding: '0.75rem', color: '#cbd5e1' }}>{user.email}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: user.role.includes('CAE') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                        color: user.role.includes('CAE') ? '#34d399' : '#60a5fa'
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', color: '#94a3b8', fontSize: '0.78rem' }}>{user.department}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#34d399', fontSize: '0.75rem', fontWeight: 600 }}>
                        <CheckCircle2 size={12} />
                        Active
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                      <button 
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        style={{
                          padding: '0.3rem 0.5rem',
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: '4px',
                          color: '#f87171',
                          cursor: 'pointer'
                        }}
                        title="Revoke Access"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '1rem 1.75rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Lock size={12} color="#10b981" />
            <span>Strict Departmental Boundary · Internal Audit Staff Only</span>
          </div>
          <button 
            onClick={onClose}
            style={{
              padding: '0.45rem 1.25rem',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '6px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditUserManagementModal;
