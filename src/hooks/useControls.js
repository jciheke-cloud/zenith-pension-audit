import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export const useControls = () => {
  return useQuery({
    queryKey: ['controls'],
    queryFn: async () => {
      const { data } = await api.get('/api/controls');
      return data;
    },
    initialData: []
  });
};
