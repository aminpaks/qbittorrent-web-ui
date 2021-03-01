import { useMutation } from 'react-query';
import { apiV2OperateCategory, CategoryOperationResponse } from '../../api';
import { LazyReason } from '../../types';

export const useCategoryOperationsMutation = (
  { onSuccess, onError } = {} as {
    onSuccess?: LazyReason<Promise<void> | void, CategoryOperationResponse>;
    onError?: LazyReason<Promise<void> | void>;
  }
) => {
  const mutationObject = useMutation(apiV2OperateCategory, {
    retry: false,
    onSuccess,
    onError,
  });

  return mutationObject;
};
