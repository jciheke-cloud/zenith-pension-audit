import React, { useRef, useContext, useState } from 'react';
import * as XLSX from 'xlsx';
import { AuditContext } from '../context/AuditContext';

const AuditDataUpload = ({ targetModule = 'findings', buttonText = '📥 Batch Data Ingestion' }) => {
  const { bulkUploadRecords } = useContext(AuditContext);
  const fileInputRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [parsedData, setParsedData] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const getTemplateConfig = () => {
    switch (targetModule) {
      case 'universe':
        return {
          filename: 'ZPC_Audit_Universe_Template.xlsx',
          sheetName: 'UniverseTemplate',
          headers: ['unitId', 'department', 'processName', 'inherentRisk', 'financialExposure', 'regulatoryImpact'],
          data: [
            { unitId: 'UNIV-101', department: 'Treasury & Markets', processName: 'Money Market Placement & Haircut Controls', inherentRisk: 8, financialExposure: 9, regulatoryImpact: 8 },
            { unitId: 'UNIV-102', department: 'IT & Cybersecurity', processName: 'Core Banking & Custody DB Failover', inherentRisk: 9, financialExposure: 8, regulatoryImpact: 9 }
          ]
        };
      case 'plans':
        return {
          filename: 'ZPC_Annual_Plans_Template.xlsx',
          sheetName: 'PlansTemplate',
          headers: ['planId', 'auditName', 'department', 'plannedHours', 'actualHours', 'status', 'startDate', 'endDate', 'leadAuditor'],
          data: [
            { planId: 'PLAN-2026-01', auditName: 'Annual Custody Operations Review', department: 'Pension Operations', plannedHours: 320, actualHours: 0, status: 'Approved', startDate: '2026-02-01', endDate: '2026-03-15', leadAuditor: 'Chief Senior Auditor' },
            { planId: 'PLAN-2026-02', auditName: 'RMAS Cybersecurity Penetration Test', department: 'IT & Cybersecurity', plannedHours: 240, actualHours: 0, status: 'Approved', startDate: '2026-04-10', endDate: '2026-05-20', leadAuditor: 'Lead IT Auditor' }
          ]
        };
      case 'findings':
      default:
        return {
          filename: 'ZPC_Audit_Findings_Template.xlsx',
          sheetName: 'FindingsTemplate',
          headers: ['findingNumber', 'businessUnit', 'observation', 'criteria', 'rootCause', 'likelihood', 'impact', 'status', 'managementResponse', 'remediationDate', 'auditor'],
          data: [
            { findingNumber: 'FND-2026-101', businessUnit: 'Settlements & Corporate Actions', observation: 'Unreconciled Dividend Sweep Variance', criteria: 'PENCOM Section 63 Guidelines', rootCause: 'System timeout during clearing', likelihood: 7, impact: 8, status: 'Open', managementResponse: 'Reviewing automated bridge failover logs.', remediationDate: '2026-09-30', auditor: 'Chief Senior Auditor' },
            { findingNumber: 'FND-2026-102', businessUnit: 'Contribution Reconciliation Dept', observation: '24h Employer Contribution Schedule Delay', criteria: 'SLA Breach Prevention Circular', rootCause: 'Portal schedule ingestion lag', likelihood: 6, impact: 8, status: 'Open', managementResponse: 'Upgraded employer api gateway bandwidth.', remediationDate: '2026-08-15', auditor: 'Lead Operations Auditor' }
          ]
        };
    }
  };

  const downloadTemplate = () => {
    const config = getTemplateConfig();
    const ws = XLSX.utils.json_to_sheet(config.data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, config.sheetName);
    XLSX.writeFile(wb, config.filename);
    setMsg('Template downloaded successfully!');
    setTimeout(() => setMsg(''), 3000);
  };

  const processFile = (file) => {
    const fileType = file.name.split('.').pop().toLowerCase();
    
    if (fileType === 'json') {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = JSON.parse(evt.target.result);
          if (Array.isArray(data)) {
            setParsedData(data);
            setMsg(`Successfully parsed ${data.length} records.`);
          } else {
            setMsg('Error: JSON must be an array of objects.');
          }
        } catch (err) {
          setMsg('Error parsing JSON.');
        }
      };
      reader.readAsText(file);
    } else if (['csv', 'xlsx', 'xls'].includes(fileType)) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const bstr = evt.target.result;
          const wb = XLSX.read(bstr, { type: 'binary' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws);
          setParsedData(data);
          setMsg(`Successfully parsed ${data.length} records.`);
        } catch (error) {
          setMsg('Error reading Excel/CSV file.');
        }
      };
      reader.readAsBinaryString(file);
    } else {
      setMsg('Unsupported file type. Please upload Excel or CSV.');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const commitIngest = () => {
    if (parsedData.length === 0) return;
    
    if (bulkUploadRecords) {
      bulkUploadRecords(targetModule, parsedData);
    }
    
    setIsOpen(false);
    setParsedData([]);
    setMsg('');
  };

  const config = getTemplateConfig();

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="btn-secondary"
        style={{
          borderColor: '#10B981', color: '#6ee7b7',
          display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer'
        }}
      >
        <span>📥</span> {buttonText}
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: '#121a2e', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '0.75rem', width: '90%', maxWidth: '650px', padding: '1.5rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', display: 'flex', flexDirection: 'column', gap: '1rem',
            color: 'white', fontFamily: 'sans-serif'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: 'white', fontSize: '1.1rem', fontWeight: 600 }}>
                🏛️ Audit Batch Ingestion Portal — {targetModule.toUpperCase()}
              </h3>
              <button 
                onClick={() => { setIsOpen(false); setParsedData([]); setMsg(''); }}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.25rem', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                onClick={downloadTemplate}
                style={{
                  flex: 1, padding: '0.55rem', borderRadius: '0.35rem', border: '1px solid #10b981',
                  background: 'rgba(16, 185, 129, 0.1)', color: '#6ee7b7', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer'
                }}
              >
                📥 Download structured template
              </button>
              <button 
                onClick={() => fileInputRef.current.click()}
                style={{
                  flex: 1, padding: '0.55rem', borderRadius: '0.35rem', border: '1px solid #3b82f6',
                  background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer'
                }}
              >
                📂 Browse Spreadsheet file
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                accept=".csv,.xlsx,.xls,.json" 
                onChange={handleFileUpload} 
                style={{ display: 'none' }} 
              />
            </div>

            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                border: isDragOver ? '2px dashed #60a5fa' : '2px dashed rgba(255,255,255,0.15)',
                borderRadius: '0.5rem', padding: '2rem 1rem', textAlign: 'center',
                background: isDragOver ? 'rgba(59, 130, 246, 0.05)' : 'rgba(0,0,0,0.15)',
                transition: 'all 0.2s ease', cursor: 'pointer'
              }}
              onClick={() => fileInputRef.current.click()}
            >
              <span style={{ fontSize: '1.75rem', display: 'block', marginBottom: '0.5rem' }}>📊</span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Drag & Drop your completed audit template file here, or click to browse.
              </span>
            </div>

            {msg && (
              <div style={{
                fontSize: '0.8rem', color: msg.includes('Error') ? '#f87171' : '#34d399',
                padding: '0.5rem 0.75rem', borderRadius: '0.25rem', background: 'rgba(0,0,0,0.2)', fontWeight: 600
              }}>
                {msg}
              </div>
            )}

            {parsedData.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>Parsed Audit Records Preview:</span>
                <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.35rem' }}>
                  <table style={{ width: '100%', fontSize: '0.75rem', borderCollapse: 'collapse', color: '#cbd5e1' }}>
                    <thead>
                      <tr style={{ background: '#0b0f19', borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                        {config.headers.map((h, i) => <th key={i} style={{ padding: '0.4rem' }}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {parsedData.slice(0, 10).map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          {config.headers.map((h, i) => <td key={i} style={{ padding: '0.4rem' }}>{String(row[h] || '')}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {parsedData.length > 10 && (
                    <div style={{ padding: '0.35rem', textAlign: 'center', fontSize: '0.7rem', color: '#64748b', background: '#0b0f19' }}>
                      + {parsedData.length - 10} more rows
                    </div>
                  )}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button 
                onClick={() => { setIsOpen(false); setParsedData([]); setMsg(''); }}
                style={{
                  padding: '0.45rem 1rem', borderRadius: '0.35rem', border: '1px solid rgba(255,255,255,0.1)',
                  background: 'transparent', color: '#cbd5e1', fontSize: '0.8rem', cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={commitIngest}
                disabled={parsedData.length === 0}
                style={{
                  padding: '0.45rem 1.25rem', borderRadius: '0.35rem', border: 'none',
                  background: parsedData.length > 0 ? '#10b981' : '#475569',
                  color: 'white', fontSize: '0.8rem', fontWeight: 600,
                  cursor: parsedData.length > 0 ? 'pointer' : 'not-allowed'
                }}
              >
                🚀 Import Ingest ({parsedData.length} records)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AuditDataUpload;
