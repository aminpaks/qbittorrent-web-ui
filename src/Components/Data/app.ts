import { useQuery } from 'react-query';
import { apiV2AppPreferences, apiV2AppVersion } from '../../api';

export const useAppVersionQuery = () => {
  const queryResult = useQuery('app-version', () => apiV2AppVersion(), {
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
  });

  return queryResult;
};

export const useAppPreferencesQuery = () => {
  const queryResult = useQuery('app-preferences', () => apiV2AppPreferences(), {
    retry: 0,
  });

  return queryResult;
};
