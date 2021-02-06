import fuzzysort from 'fuzzysort';
import { FormattedMessage } from 'react-intl';
import { ConnectionStatus, Torrent } from '../../api';
import { TorrentKeys } from '../../types';
import { usePersistentMemo } from '../utils';
import { useTorrentsState } from './server-state';
import { SortFilterStateValue } from './types';
import { useUiState } from './ui-state';

export const getConnectionStatusString = (status: ConnectionStatus) => {
  switch (status) {
    case 'connected':
      return <FormattedMessage defaultMessage="online" tagName="span" />;
    case 'firewalled':
      return <FormattedMessage defaultMessage="limited" tagName="span" />;
    case 'disconnected':
    default:
      return <FormattedMessage defaultMessage="offline" tagName="span" />;
  }
};

export const usePersistentSelectedTorrents = (): [Torrent[], (shouldPersist?: boolean) => void, string[]] => {
  const { collection, hashList } = useTorrentsState();
  const [{ torrentListSelection: selection }] = useUiState();

  const [torrents, persist] = usePersistentMemo(() => selection.map(hash => collection[hash] ?? { hash }), [
    selection,
    hashList,
  ]);

  return [torrents, persist, hashList];
};

const toString = (i: boolean | number | string) => {
  if (typeof i === 'string') {
    return i.toLowerCase();
  } else if (typeof i === 'number') {
    return i.toFixed(4).padStart(50, '0');
  }
  return String(i);
};

export const sortByPriorityOrName = (x: Torrent, y: Torrent) => {
  if (x.priority === 0 && y.priority === 0) {
    return toString(x.name).localeCompare(toString(y.name));
  } else if (x.priority === 0 && y.priority !== 0) {
    return 1;
  } else if (x.priority !== 0 && y.priority === 0) {
    return -1;
  }
  return toString(x.priority).localeCompare(toString(y.priority));
};

export const sortTorrent = (l: Torrent[], sortBy: TorrentKeys = 'priority', asc = true) => {
  l.sort((x, y) => {
    const xSortValue = x[sortBy];
    const ySortValue = y[sortBy];

    if (sortBy === 'priority') {
      return sortByPriorityOrName(x, y);
    }

    let result = toString(xSortValue).localeCompare(toString(ySortValue));

    if (result === 0) {
      return sortByPriorityOrName(x, y);
    }

    return result;
  });

  if (asc === false) {
    l.reverse();
  }
  return l;
};

export const toHashList = (l: Torrent[]) => l.map(({ hash }) => hash);

export const sortAndFilter = (state: SortFilterStateValue, l: Torrent[]): Torrent[] => {
  const { column, asc, search } = state;

  if (search) {
    const fuzzyResults = fuzzysort.go(search, l, { key: 'name' });
    return fuzzyResults.map(({ obj }) => obj);
  }

  return sortTorrent(l, column, asc);
};
