import fuzzysort from 'fuzzysort';
import { FormattedMessage, IntlShape } from 'react-intl';
import { Category, ConnectionStatus, Torrent, TorrentKeys } from '../../api';
import { usePersistentMemo } from '../utils';
import { useTorrentsState } from './server-state';
import { CategoryState, SortFilterStateValue } from './types';
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

export const getNormalizedCategory = (cat: string) => (cat ? cat : '__none__');

export const sortAndFilter = (
  state: SortFilterStateValue,
  l: Torrent[],
  categoryState: CategoryState
): Torrent[] => {
  const { column, asc, search, category: selectedCategory } = state;

  if (search) {
    const fuzzyResults = fuzzysort.go(search, l, { key: 'name' });
    return fuzzyResults.map(({ obj }) => obj);
  }

  const filteredList =
    selectedCategory === '__all__'
      ? l
      : l.filter(({ category }) => getNormalizedCategory(category) === selectedCategory);

  return sortTorrent(filteredList, column, asc);
};

export const buildCategory = ({
  name,
  savePath = '',
  hashList = [],
  __internal = false,
}: Partial<Omit<Category, 'name'>> & { name: string }): Category => ({
  name,
  savePath,
  hashList,
  __internal,
});

export const getCategoryName = (c: Category) => (c.__internal ? c.__internal : c.name);

export const getInitialCategories = (intl: IntlShape, serverCategories: Record<string, Category>) => {
  return Object.entries(serverCategories).reduce(
    (acc, [categoryName, category]) => {
      acc[categoryName] = buildCategory(category);

      return acc;
    },
    {
      __all__: buildCategory({
        __internal: '__all__',
        name: intl.formatMessage({ defaultMessage: 'All categories' }),
      }),
      __none__: buildCategory({
        __internal: '__none__',
        name: intl.formatMessage({ defaultMessage: 'Uncategorized' }),
      }),
    } as Record<string, Category>
  );
};
