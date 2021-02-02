import produce from 'immer';
import fuzzysort from 'fuzzysort';
import { createContext, FC, useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react';
import { apiV2SyncMaindata, ServerState, SyncMaindata, Torrent } from '../../api';
import { TorrentCollection } from '../../types';
import { storageGet, storageSet, tryCatch, unsafeMutateDefaults } from '../../utils';

type TorrentKeys = keyof Torrent;
interface SortFilterStateValue {
  column: TorrentKeys;
  asc: boolean;
  search: string;
}
type SortFilterState = [SortFilterStateValue, SortFilterHandler];
type SortFilterHandler = (payload: { column?: TorrentKeys; search?: string }) => void;

const TORRENT_SORT_KEY = 'torrentListSortFilter';

const initialServerState = {} as ServerState;
const initialTorrentsState = { collection: {}, hashList: [], viewHashList: [] } as {
  collection: TorrentCollection;
  hashList: string[];
  viewHashList: string[];
};
const initialTorrentSortFilterState: SortFilterStateValue = {
  column: 'priority',
  asc: true,
  search: '',
};

const ServerContext = createContext(initialServerState);
const TorrentsContext = createContext(initialTorrentsState);
const TorrentHashListContext = createContext(initialTorrentsState.hashList);
const TorrentViewHashListContext = createContext(initialTorrentsState.viewHashList);
const TorrentSortFilterContext = createContext(([
  initialTorrentSortFilterState,
  undefined,
] as unknown) as SortFilterState);

const toString = (i: boolean | number | string) => {
  if (typeof i === 'string') {
    return i.toLowerCase();
  } else if (typeof i === 'number') {
    return i.toFixed(4).padStart(50, '0');
  }
  return String(i);
};

const sortByPriorityOrName = (x: Torrent, y: Torrent) => {
  if (x.priority === 0 && y.priority === 0) {
    return toString(x.name).localeCompare(toString(y.name));
  } else if (x.priority === 0 && y.priority !== 0) {
    return 1;
  } else if (x.priority !== 0 && y.priority === 0) {
    return -1;
  }
  return toString(x.priority).localeCompare(toString(y.priority));
};

const sortTorrent = (l: Torrent[], sortBy: TorrentKeys = 'priority', asc = true) => {
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

const toHashList = (l: Torrent[]) => l.map(({ hash }) => hash);

const sortAndFilter = (state: SortFilterStateValue, l: Torrent[]): Torrent[] => {
  const { column, asc, search } = state;

  if (search) {
    const fuzzyResults = fuzzysort.go(search, l, { key: 'name' });
    return fuzzyResults.map(({ obj }) => obj);
  }

  return sortTorrent(l, column, asc);
};

export const AppContextProvider: FC = ({ children }) => {
  const referenceId = useRef(0);
  const [sortFilterRefId, setSortFilterRefId] = useState(0);
  const [serverState, setServerState] = useState(initialServerState);
  const [torrentsState, setTorrentsState] = useState(initialTorrentsState);
  const [torrentSortFilterState, setTorrentSortState] = useState(
    unsafeMutateDefaults(initialTorrentSortFilterState)(
      storageGet(TORRENT_SORT_KEY, {} as SortFilterStateValue)
    )
  );
  const torrentSortFilterStateRef = useRef(torrentSortFilterState);

  const handleListSortFilter = useCallback<SortFilterHandler>(payload => {
    setTorrentSortState(s => {
      const { column, search } = payload;

      const updatedSort = produce(s, draft => {
        if (column) {
          if (draft.column === column) {
            draft.asc = !draft.asc;
          } else {
            draft.asc = true;
          }
          draft.column = column;
        }
        if (search != null) {
          draft.search = search;
        }
      });

      return storageSet(TORRENT_SORT_KEY, updatedSort);
    });
  }, []);

  useEffect(() => {
    let tid: number | null = null;
    let nextFetchDelay = 1_000;

    async function fetchMaindata() {
      const sync = await tryCatch(() => apiV2SyncMaindata(referenceId.current), {} as SyncMaindata);
      const { rid, full_update, torrents = {}, torrents_removed, server_state } = sync;

      if (rid) {
        referenceId.current = rid;
        if (torrents_removed && torrents_removed.length > 0) {
          setSortFilterRefId(Date.now());
          setTorrentsState(s =>
            produce(s, draft => {
              draft.hashList = draft.hashList.filter(hash => torrents_removed.indexOf(hash) < 0);
              torrents_removed.forEach(hash => {
                delete draft.collection[hash];
              });
            })
          );
        }

        const torrentHashes = Object.keys(torrents);
        if (full_update) {
          // Mutate items and update hash property
          for (const hash in torrents) {
            torrents[hash].hash = hash;
          }
          setTorrentsState({
            collection: torrents as TorrentCollection,
            hashList: torrentHashes,
            viewHashList: [],
          });
          setSortFilterRefId(Date.now());
        } else if (torrentHashes.length > 0) {
          setTorrentsState(s => {
            return produce(s, draft => {
              let shouldUpdateHashOrder = false;
              const collection = draft.collection;
              torrentHashes.forEach(hash => {
                const currentItem = collection[hash] as Torrent | undefined;
                const torrent = torrents[hash];
                if (currentItem) {
                  Object.entries(torrent).forEach(item => {
                    const [key, value] = item as [TorrentKeys, never];
                    if (key === torrentSortFilterStateRef.current.column) {
                      shouldUpdateHashOrder = true;
                    }
                    currentItem[key] = value;
                  });
                } else {
                  shouldUpdateHashOrder = true;
                  draft.collection[hash] = { ...torrent, hash } as Torrent;
                  draft.hashList.push(hash);
                }

                if (shouldUpdateHashOrder) {
                  setSortFilterRefId(Date.now());
                }
              });
            });
          });
        }

        // Update Server state
        if (server_state) {
          if (full_update) {
            setServerState(server_state);
          } else {
            setServerState(s =>
              produce(s, (draft: any) => {
                for (const key in server_state) {
                  draft[key] = (server_state as any)[key];
                }
              })
            );
          }
        }
      } else {
        nextFetchDelay = 30_000;
      }

      tid = window.setTimeout(() => {
        fetchMaindata();
      }, nextFetchDelay);
    }

    fetchMaindata();

    return () => {
      if (tid) {
        window.clearTimeout(tid);
      }
    };
  }, []);

  useEffect(() => {
    torrentSortFilterStateRef.current = torrentSortFilterState;

    setTorrentsState(s => {
      const result = produce(s, draft => {
        draft.viewHashList = toHashList(sortAndFilter(torrentSortFilterState, Object.values(s.collection)));
      });
      return result;
    });
  }, [torrentSortFilterState, sortFilterRefId]);

  return (
    <ServerContext.Provider value={serverState}>
      <TorrentsContext.Provider value={torrentsState}>
        <TorrentHashListContext.Provider value={torrentsState.hashList}>
          <TorrentViewHashListContext.Provider value={torrentsState.viewHashList}>
            <TorrentSortFilterContext.Provider value={[torrentSortFilterState, handleListSortFilter]}>
              {children}
            </TorrentSortFilterContext.Provider>
          </TorrentViewHashListContext.Provider>
        </TorrentHashListContext.Provider>
      </TorrentsContext.Provider>
    </ServerContext.Provider>
  );
};

export const useServerState = () => {
  return useContext(ServerContext);
};

export const useTorrentsState = () => {
  return useContext(TorrentsContext);
};

export const useTorrentList = () => {
  return useContext(TorrentHashListContext);
};

export const useTorrentViewList = () => {
  return useContext(TorrentViewHashListContext);
};

export const useTorrentSortFilterState = () => {
  return useContext(TorrentSortFilterContext);
};
