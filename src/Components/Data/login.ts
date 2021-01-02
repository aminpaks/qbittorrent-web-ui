import { useMutation } from 'react-query';
import { apiV2AuthLogin } from '../../api';

export const useLoginMutation = (successCallback: () => void) => {
  const mutation = useMutation(
    ({ username, password }: { username: string; password: string }) =>
      apiV2AuthLogin(username, password),
    {
      retry: 2,
      mutationKey: 'auth-login',
      onSuccess: successCallback,
    }
  );

  return mutation;
};
