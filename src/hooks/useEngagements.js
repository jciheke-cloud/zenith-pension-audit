import { useContext } from 'react';
import { AuditContext } from '../context/AuditContext';

export const useEngagements = () => {
  const { auditPlans } = useContext(AuditContext);
  return { data: Array.isArray(auditPlans) ? auditPlans : [] };
};
