import { useQuery } from 'react-query';
import { apiV2AppVersion } from '../../api';

export const useAppVersionQuery = () => {
  const queryResult = useQuery('app-version', () => apiV2AppVersion(), {
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
  });

  return queryResult;
};
