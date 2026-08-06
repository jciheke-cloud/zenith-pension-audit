import { useContext } from 'react';
import { AuditContext } from '../context/AuditContext';

export const useControls = () => {
  const { controls } = useContext(AuditContext);
  return { data: Array.isArray(controls) ? controls : [] };
};
