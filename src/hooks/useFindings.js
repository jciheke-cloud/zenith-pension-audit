import { useContext } from 'react';
import { AuditContext } from '../context/AuditContext';

export const useFindings = () => {
  const { findings } = useContext(AuditContext);
  return { data: Array.isArray(findings) ? findings : [] };
};
