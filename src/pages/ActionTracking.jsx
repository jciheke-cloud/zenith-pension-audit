import React, { useContext, useState, useEffect } from 'react';
import { AuditContext } from '../context/AuditContext';
import api from '../services/api';
import { CheckSquare, AlertTriangle, Clock, ShieldCheck, ArrowRight, RefreshCw, Send, Paperclip, CheckCircle2, FileCheck, Eye, Search, Filter } from 'lucide-react';
import AuditDataUpload from '../components/AuditDataUpload';

const ActionTracking = () => {
  const { addNotification } = useContext(AuditContext);
  const [findings, setFindings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/api/audit/actions');
        setFindings(res.data);
      } catch (err) {
        console.error('Failed to fetch actions:', err);
      }
    };
    fetchData();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    const prevFindings = [...findings];
    const cap = prevFindings.find(f => (f.findingNumber || f.id) === id);
    if (!cap) return;
    const updatedCap = { ...cap, status: newStatus };
    setFindings(prev => prev.map(f => (f.findingNumber || f.id) === id ? updatedCap : f));
    try {
      await api.post('/api/audit/actions', updatedCap);
    } catch (err) {
      setFindings(prevFindings);
      addNotification('Error', 'Failed to update action tracking status.', 'danger');
    }
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Proof Submission Modal */}
      {proofModalCap && (
        <div className="modal-overlay">
          <div className="modal-content max-w-[520px]">
            <div className="flex justify-between items-center mb-5">
              <h3 className="m-0 text-[1.15rem] font-extrabold">Submit Remediation Proof (Action Owner)</h3>
              <button onClick={() => setProofModalCap(null)} className="bg-transparent border-none text-[var(--text-muted)] cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleSubmitProof} className="flex flex-col gap-4">
              <div>
                <label className="block text-[0.8rem] font-bold mb-[0.4rem] text-[var(--text-secondary)]">Finding Reference</label>
                <input type="text" disabled value={`${proofModalCap.findingNumber} - ${proofModalCap.observation}`} className="form-input opacity-80" />
              </div>
              <div>
                <label className="block text-[0.8rem] font-bold mb-[0.4rem] text-[var(--text-secondary)]">Action Owner Remediation Summary</label>
                <textarea 
                  required 
                  rows={3} 
                  value={remediationProofNote} 
                  onChange={e => setRemediationProofNote(e.target.value)} 
                  className="form-input" 
                  placeholder="Describe control changes, software patch deployed, or procedural update implemented..." 
                />
              </div>
              <div>
                <label className="block text-[0.8rem] font-bold mb-[0.4rem] text-[var(--text-secondary)]">Attach Evidence Document / System Screenshot</label>
                <input type="file" className="form-input p-[0.4rem]" />
              </div>
              <div className="flex justify-end gap-[0.85rem] mt-4">
                <button type="button" onClick={() => setProofModalCap(null)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Submit to Auditor for Retesting</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Auditor Verification Sign-Off Modal */}
      {retestModalCap && (
        <div className="modal-overlay">
          <div className="modal-content max-w-[540px]">
            <div className="flex justify-between items-center mb-5">
              <h3 className="m-0 text-[1.15rem] font-extrabold text-[#10B981]">Auditor Verification & Retest Sign-Off</h3>
              <button onClick={() => setRetestModalCap(null)} className="bg-transparent border-none text-[var(--text-muted)] cursor-pointer">✕</button>
            </div>
            <form onSubmit={handlePassRetest} className="flex flex-col gap-4">
              <div>
                <label className="block text-[0.8rem] font-bold mb-[0.4rem] text-[var(--text-secondary)]">Finding Reference</label>
                <input type="text" disabled value={`${retestModalCap.findingNumber} - ${retestModalCap.observation}`} className="form-input opacity-80" />
              </div>
              <div>
                <label className="block text-[0.8rem] font-bold mb-[0.4rem] text-[var(--text-secondary)]">Auditor Verification & Retesting Evaluation</label>
                <textarea 
                  required 
                  rows={3} 
                  value={auditorVerificationNote} 
                  onChange={e => setAuditorVerificationNote(e.target.value)} 
                  className="form-input" 
                  placeholder="Detail auditor retesting steps performed, sample verified, and confirmation of control effectiveness..." 
                />
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-[0.8rem] rounded-md text-[0.78rem] text-[#34d399]">
                ✓ Submitting this sign-off will permanently close Finding {retestModalCap.findingNumber} and log an immutable audit log entry.
              </div>
              <div className="flex justify-end gap-[0.85rem] mt-2">
                <button type="button" onClick={() => setRetestModalCap(null)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-success">✓ Sign-Off & Close Finding</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionTracking;
