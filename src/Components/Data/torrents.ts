import { useQuery } from 'react-query';
import { apiV2TorrentsInfo } from '../../api';

export const useTorrentsQuery = () => {
  const queryResult = useQuery('torrents', () => apiV2TorrentsInfo(), {
    retry: 2,
  });

  return queryResult;
};
