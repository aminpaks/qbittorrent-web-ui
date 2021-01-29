import produce from 'immer';
import { createContext, FC, useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react';
import { apiV2SyncMaindata, ServerState, SyncMaindata, Torrent } from '../../api';
import { TorrentCollection } from '../../types';
import { storageGet, storageSet, tryCatch } from '../../utils';

type TorrentKeys = keyof Torrent;

const TORRENT_SORT_KEY = 'torrentListSort';

const initialServerState = {} as ServerState;
const initialTorrentsState = { collection: {}, hashList: [] } as {
  collection: TorrentCollection;
  hashList: string[];
};
const initialTorrentSortState = {
  column: 'priority' as TorrentKeys,
  desc: false,
};

const ServerContext = createContext(initialServerState);
const TorrentsContext = createContext(initialTorrentsState);
const TorrentHashListContext = createContext(initialTorrentsState.hashList);
const TorrentSortContext = createContext(([initialTorrentSortState, undefined] as unknown) as [
  typeof initialTorrentSortState,
  (column: TorrentKeys) => void
]);

const toString = (i: boolean | number | string) => {
  if (typeof i === 'string') {
    return i.toLowerCase();
  } else if (typeof i === 'number') {
    return i.toFixed(4).padStart(50, '0');
  }
  return String(i);
};

const sortByPriority = (x: Torrent, y: Torrent, isDesc: boolean) => {
  if (x.priority === 0 && y.priority === 0) {
    return isDesc
      ? toString(y.name).localeCompare(toString(x.name))
      : toString(x.name).localeCompare(toString(y.name));
  } else if (x.priority === 0 && y.priority !== 0) {
    return isDesc ? -1 : 1;
  } else if (x.priority !== 0 && y.priority === 0) {
    return isDesc ? 1 : -1;
  }
  return isDesc
    ? toString(y.priority).localeCompare(toString(x.priority))
    : toString(x.priority).localeCompare(toString(y.priority));
};

const sortTorrent = (l: Torrent[], sortBy: TorrentKeys = 'priority', desc = false) => {
  l.sort((x, y) => {
    const xSortValue = x[sortBy];
    const ySortValue = y[sortBy];

    if (sortBy === 'priority') {
      return sortByPriority(x, y, desc);
    }

    let result = toString(xSortValue).localeCompare(toString(ySortValue));

    if (result === 0) {
      return sortByPriority(x, y, desc);
    }

    return result;
  });

  if (desc === true) {
    l.reverse();
  }
  return l.map(({ hash }) => hash);
};

export const AppContextProvider: FC = ({ children }) => {
  const referenceId = useRef(0);
  const [serverState, setServerState] = useState(initialServerState);
  const [torrentsState, setTorrentsState] = useState(initialTorrentsState);
  const [torrentSortState, setTorrentSortState] = useState(
    storageGet(TORRENT_SORT_KEY, initialTorrentSortState)
  );
  const torrentSortStateRef = useRef(torrentSortState);

  const handleSortBy = useCallback((column: TorrentKeys) => {
    setTorrentSortState(s => {
      const updatedSort = produce(s, draft => {
        if (draft.column === column) {
          draft.desc = !draft.desc;
        } else {
          draft.desc = false;
        }
        draft.column = column;
      });

      return storageSet(TORRENT_SORT_KEY, updatedSort);
    });
  }, []);

  useEffect(() => {
    const { column, desc } = torrentSortState;
    const { column: columnRef, desc: descRef } = torrentSortStateRef.current;
    if (column !== columnRef || desc !== descRef) {
      torrentSortStateRef.current = torrentSortState;

      setTorrentsState(s =>
        produce(s, draft => {
          draft.hashList = sortTorrent(
            Object.values(s.collection),
            torrentSortState.column,
            torrentSortState.desc
          );
        })
      );
    }
  }, [torrentSortState]);

  useEffect(() => {
    let tid: number | null = null;
    let nextFetchDelay = 1_000;

    async function fetchMaindata() {
      const sync = await tryCatch(() => apiV2SyncMaindata(referenceId.current), {} as SyncMaindata);
      const { rid, full_update, torrents = {}, torrents_removed, server_state } = sync;

      if (rid) {
        referenceId.current = rid;

        if (torrents_removed && torrents_removed.length > 0) {
          setTorrentsState(s =>
            produce(s, draft => {
              draft.hashList = draft.hashList.filter(hash => torrents_removed.indexOf(hash) < 0);
              torrents_removed.forEach(hash => {
                delete draft.collection[hash];
              });
            })
          );
        }

        const { column: sortingBy, desc: isSortingDesc } = torrentSortStateRef.current;
        const torrentHashes = Object.keys(torrents);
        if (full_update) {
          // Mutate items and update hash property
          for (const hash in torrents) {
            torrents[hash].hash = hash;
          }
          setTorrentsState({
            collection: torrents as TorrentCollection,
            hashList: sortTorrent(Object.values(torrents) as Torrent[], sortingBy, isSortingDesc),
          });
        } else if (torrentHashes.length > 0) {
          setTorrentsState(s => {
            return produce(s, draft => {
              let shouldUpdateHashOrder = false;
              torrentHashes.forEach(hash => {
                const currentItem = draft.collection[hash] as Torrent | undefined;
                const torrent = torrents[hash];
                if (currentItem) {
                  Object.entries(torrent).forEach(item => {
                    const [key, value] = item as [TorrentKeys, never];
                    if (key === sortingBy) {
                      shouldUpdateHashOrder = true;
                    }
                    currentItem[key] = value;
                  });
                } else {
                  draft.collection[hash] = { ...torrent, hash } as Torrent;
                  draft.hashList.push(hash);
                }
              });
              if (shouldUpdateHashOrder) {
                draft.hashList = sortTorrent(
                  Object.values(draft.collection) as Torrent[],
                  sortingBy,
                  isSortingDesc
                );
              }
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

  return (
    <ServerContext.Provider value={serverState}>
      <TorrentsContext.Provider value={torrentsState}>
        <TorrentHashListContext.Provider value={torrentsState.hashList}>
          <TorrentSortContext.Provider value={[torrentSortState, handleSortBy]}>
            {children}
          </TorrentSortContext.Provider>
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

export const useTorrentSort = () => {
  return useContext(TorrentSortContext);
};
