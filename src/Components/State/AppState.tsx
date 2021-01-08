import produce from 'immer';
import { createContext, FC, useContext, useEffect, useRef, useState } from 'react';
import { apiV2SyncMaindata, ServerState, SyncMaindata, Torrent } from '../../api';
import { TorrentCollection } from '../../types';
import { tryCatch } from '../../utils';

const initialServerState = {} as ServerState;
const initialTorrentsState = { collection: {}, hashList: [] } as {
  collection: TorrentCollection;
  hashList: string[];
};

const ServerContext = createContext(initialServerState);
const TorrentsContext = createContext(initialTorrentsState);

const sortTorrent = (l: Torrent[]) =>
  l
    .sort(({ priority: xPriority = 0, name: xName }, { priority: yPriority = 0, name: yName }) => {
      if (xPriority === 0 && yPriority === 0) {
        return xName.localeCompare(yName);
      } else if (xPriority === 0 && yPriority !== 0) {
        return 1;
      } else if (xPriority !== 0 && yPriority === 0) {
        return -1;
      }

      const xStrPriority = String(xPriority).padStart(20, '0');
      const yStrPriority = String(yPriority).padStart(20, '0');

      return xStrPriority.localeCompare(yStrPriority);
    })
    .map(({ hash }) => hash);

export const AppContextProvider: FC = ({ children }) => {
  const referenceId = useRef(0);
  const [serverState, setServerState] = useState(initialServerState);
  const [torrentsState, setTorrentsState] = useState(initialTorrentsState);

  useEffect(() => {
    let tid: number | null = null;

    async function fetchMaindata() {
      const sync = await tryCatch(() => apiV2SyncMaindata(referenceId.current), {} as SyncMaindata);
      const { rid, full_update, torrents = {}, torrents_removed, server_state } = sync;

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

      const torrentHashes = Object.keys(torrents);
      if (full_update) {
        // Mutate items and update hash property
        for (const hash in torrents) {
          torrents[hash].hash = hash;
        }
        setTorrentsState({
          collection: torrents as TorrentCollection,
          hashList: sortTorrent(Object.values(torrents) as Torrent[]),
        });
      } else if (torrentHashes.length > 0) {
        setTorrentsState(s => {
          return produce(s, draft => {
            let shouldUpdateHashOrder = false;
            torrentHashes.forEach(hash => {
              const currentItem = draft.collection[hash] as Torrent | null;
              const torrent = torrents[hash];
              if (currentItem) {
                Object.entries(torrent).forEach(item => {
                  const [key, value] = item as [keyof Torrent, never];
                  if (key === 'priority') {
                    shouldUpdateHashOrder = true;
                  }
                  currentItem[key] = value;
                });
              } else {
                draft.collection[hash] = torrent as Torrent;
                draft.hashList.push(hash);
              }
            });
            console.log('should update hash order?', shouldUpdateHashOrder);
            if (shouldUpdateHashOrder) {
              let updatedHashList = sortTorrent(Object.values(draft.collection) as Torrent[]);
              draft.hashList = updatedHashList;
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

      tid = window.setTimeout(() => {
        fetchMaindata();
      }, 1_000);
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
      <TorrentsContext.Provider value={torrentsState}>{children}</TorrentsContext.Provider>
    </ServerContext.Provider>
  );
};

export const useServerState = () => {
  return useContext(ServerContext);
};

export const useTorrentsState = () => {
  return useContext(TorrentsContext);
};
