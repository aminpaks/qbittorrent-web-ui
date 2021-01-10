import { useMutation } from 'react-query';
import { apiV2AuthLogin } from '../../api';
import { LazyReason, NoOp } from '../../types';

export const useLoginMutation = (
  { onSuccess, onError } = {} as { onSuccess?: NoOp; onError?: LazyReason<void> }
) => {
  const mutation = useMutation(
    ({ username, password }: { username: string; password: string }) => apiV2AuthLogin(username, password),
    {
      retry: 2,
      mutationKey: 'auth-login',
      onSuccess,
      onError,
    }
  );

  return mutation;
};
