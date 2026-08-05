import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export const useAuditUniverse = () => {
  return useQuery({
    queryKey: ['auditUniverse'],
    queryFn: async () => {
      const { data } = await api.get('/api/audit/universe');
      return data;
    },
    initialData: []
  });
};
