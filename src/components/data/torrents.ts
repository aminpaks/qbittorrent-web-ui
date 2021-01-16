import { useMutation, useQuery } from 'react-query';
import { apiV2TorrentsBasicAction, apiV2TorrentsInfo, TorrentPrimitiveOperationOptions } from '../../api';
import { LazyReason } from '../../types';

export const useTorrentsQuery = () => {
  const queryResult = useQuery('torrents', () => apiV2TorrentsInfo(), {
    retry: 2,
  });

  return queryResult;
};

export const useTorrentsOperationMutation = (
  { onSuccess, onError } = {} as {
    onSuccess?: LazyReason<Promise<void>, boolean>;
    onError?: LazyReason<Promise<void>>;
  }
) => {
  const mutationObject = useMutation(
    ({ list, params }: { list: string[]; params: TorrentPrimitiveOperationOptions }): Promise<boolean> =>
      apiV2TorrentsBasicAction(list, params),
    {
      retry: false,
      onSuccess,
      onError,
    }
  );

  return mutationObject;
};
