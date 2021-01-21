import { useQuery } from 'react-query';
import { apiV2AppPreferences, apiV2AppVersion, AppPreferences } from '../../api';
import { LazyReason } from '../../types';

export const useAppVersionQuery = () => {
  const queryResult = useQuery('app-version', () => apiV2AppVersion(), {
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
  });

  return queryResult;
};

export const useAppPreferencesQuery = (
  { onSuccess } = {} as {
    onSuccess?: LazyReason<void, AppPreferences> | LazyReason<Promise<void>, AppPreferences>;
  }
) => {
  const queryResult = useQuery('app-preferences', () => apiV2AppPreferences(), {
    retry: 0,
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    onSuccess,
  });

  return queryResult;
};
