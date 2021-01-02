import produce from 'immer';
import { createContext, FC, useContext, useEffect, useRef, useState } from 'react';
import { apiV2SyncMaindata, ServerState, SyncMaindata, Torrent } from '../../api';
import { tryCatch } from '../../utils';

const initialServerState = {} as ServerState;
const initialTorrentsState = {} as Record<string, Torrent>;

const ServerContext = createContext(initialServerState);
const TorrentsContext = createContext(initialTorrentsState);

export const AppContextProvider: FC = ({ children }) => {
  const referenceId = useRef(0);
  const [serverState, setServerState] = useState(initialServerState);
  const [torrentsState, setTorrentsState] = useState(initialTorrentsState);

  useEffect(() => {
    async function fetchMaindata() {
      const sync = await tryCatch(() => apiV2SyncMaindata(referenceId.current), {} as SyncMaindata);
      const { rid, full_update, torrents = {}, torrents_removed, server_state } = sync;

      referenceId.current = rid;

      if (torrents_removed) {
        console.log(torrents_removed);
        debugger;
      }

      const torrentsEntries = Object.entries(torrents);
      if (full_update) {
        setTorrentsState(
          torrentsEntries.reduce((acc, [hash, item], index) => {
            acc[hash] = { index: index + 1, hash, ...item } as Torrent;
            return acc;
          }, {} as Record<string, Torrent>)
        );
      } else if (torrentsEntries.length > 0) {
        setTorrentsState(s => {
          return produce(s, draft => {
            let currentIndex = Object.keys(draft).length;
            torrentsEntries.forEach(([hash, item]: [string, any]) => {
              const currentItem = draft[hash] as any;
              if (currentItem) {
                for (const key in item) {
                  currentItem[key] = item[key];
                }
              } else {
                draft[hash] = { index: ++currentIndex, hash, ...item };
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

      const tid = setTimeout(() => {
        fetchMaindata();
      }, 1000);

      return () => clearTimeout(tid);
    }

    fetchMaindata();
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
