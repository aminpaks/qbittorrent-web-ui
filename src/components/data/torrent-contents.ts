import { useQuery } from 'react-query';
import { apiV2TorrentContents } from '../../api/torrent-contents';

export const useTorrentContents = (hash?: string) => {
  const queryResult = useQuery(`torrent-${hash}-contents`, () => apiV2TorrentContents(hash ?? ''), {
    retry: 2,
    enabled: !!hash,
  });

  return queryResult;
};
