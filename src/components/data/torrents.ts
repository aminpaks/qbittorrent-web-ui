import { useMutation, useQuery } from 'react-query';
import {
  apiV2TorrentsAddFile,
  apiV2TorrentsBasicAction,
  apiV2TorrentsInfo,
  TorrentAddOptions,
  TorrentPrimitiveOperationOptions,
} from '../../api';
import { LazyReason } from '../../types';

export const useTorrentsQuery = () => {
  const queryResult = useQuery('torrents', () => apiV2TorrentsInfo(), {
    retry: 2,
  });

  return queryResult;
};

export const useTorrentsOperationMutation = (
  { onSuccess, onError } = {} as {
    onSuccess?: LazyReason<Promise<void> | void, boolean>;
    onError?: LazyReason<Promise<void> | void>;
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

export const useTorrentAdd = (
  { onSuccess } = {} as { onSuccess?: LazyReason<void, boolean> | LazyReason<Promise<void>, boolean> }
) => {
  const mutationObject = useMutation(
    ({
      torrents,
      options,
    }: {
      torrents: { files: File[]; _tag: 'file' } | { urls: string[]; _tag: 'url' };
      options?: Partial<TorrentAddOptions>;
    }) => apiV2TorrentsAddFile(torrents, options),
    {
      retry: false,
      onSuccess,
    }
  );

  return mutationObject;
};
