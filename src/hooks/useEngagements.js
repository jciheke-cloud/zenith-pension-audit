import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export const useEngagements = () => {
  return useQuery({
    queryKey: ['auditPlans'],
    queryFn: async () => {
      const { data } = await api.get('/api/audit/plans');
      return data;
    },
    initialData: []
  });
};
