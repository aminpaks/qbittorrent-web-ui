import { useMutation, useQuery } from 'react-query';
import { apiV2TorrentsBasicAction, apiV2TorrentsInfo, TorrentPrimitiveOperationOptions } from '../../api';

export const useTorrentsQuery = () => {
  const queryResult = useQuery('torrents', () => apiV2TorrentsInfo(), {
    retry: 2,
  });

  return queryResult;
};

export const useTorrentsBasicActionMutation = (onError?: () => void) => {
  const mutationObject = useMutation(
    ({ list, params }: { list: string[]; params: TorrentPrimitiveOperationOptions }): Promise<boolean> =>
      apiV2TorrentsBasicAction(list, params),
    {
      retry: false,
      onError,
    }
  );

  return mutationObject;
};
