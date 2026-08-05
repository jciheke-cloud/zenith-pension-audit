import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export const useFindings = () => {
  return useQuery({
    queryKey: ['findings'],
    queryFn: async () => {
      const { data } = await api.get('/api/audit/findings');
      return data;
    },
    initialData: []
  });
};
