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

      if (torrents_removed) {
        console.log(torrents_removed);
        debugger;
      }

      const torrentHashes = Object.keys(torrents);
      if (full_update) {
        setTorrentsState({
          collection: torrents as TorrentCollection,
          hashList: torrentHashes,
        });
      } else if (torrentHashes.length > 0) {
        setTorrentsState(s => {
          return produce(s, draft => {
            torrentHashes.forEach(hash => {
              const currentItem = draft.collection[hash] as Torrent | null;
              const torrent = torrents[hash];
              if (currentItem) {
                Object.entries(torrent).forEach(item => {
                  const [key, value] = item as [keyof Torrent, never];
                  currentItem[key] = value;
                });
              } else {
                draft.collection[hash] = torrent as Torrent;
                draft.hashList.push(hash);
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
