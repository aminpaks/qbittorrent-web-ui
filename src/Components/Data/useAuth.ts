import { useQuery } from 'react-query';
import { requestAuthLoginV2 } from '../../api/auth';

export const useAuthData = (username: string, password: string) => {
  const queryResult = useQuery('auth-login', () => requestAuthLoginV2(username, password), {
    retry: 2,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
  });

  return queryResult;
};
