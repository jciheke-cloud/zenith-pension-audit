import { useContext } from 'react';
import { AuditContext } from '../context/AuditContext';

export const useAuditUniverse = () => {
  const { auditUniverse } = useContext(AuditContext);
  return { data: Array.isArray(auditUniverse) ? auditUniverse : [] };
};
