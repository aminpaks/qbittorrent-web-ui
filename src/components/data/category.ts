import { useMutation } from 'react-query';
import { apiV2SetCategory } from '../../api';
import { LazyReason } from '../../types';

export const useCategoryOperationsMutation = (
  { onSuccess, onError } = {} as {
    onSuccess?: LazyReason<Promise<void> | void, boolean>;
    onError?: LazyReason<Promise<void> | void>;
  }
) => {
  const mutationObject = useMutation(
    ({ category, list }: { category: string; list: string[] }): Promise<boolean> =>
      apiV2SetCategory(category, list),
    {
      retry: false,
      onSuccess,
      onError,
    }
  );

  return mutationObject;
};
