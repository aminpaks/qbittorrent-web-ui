import produce from 'immer';
import { useIntl } from 'react-intl';
import { createContext, FC, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { storageGet, storageSet, tryCatch, unsafeMutateDefaults } from '../../utils';
import { CategoryState, SortFilterHandler, SortFilterState, SortFilterStateValue } from './types';
import {
  buildCategory,
  getCategoryName,
  getInitialCategories,
  sortAndFilter,
  toHashList,
  getNormalizedCategory,
} from './utils';
import {
  apiV2SyncMaindata,
  Category,
  ServerState,
  SyncMaindata,
  Torrent,
  TorrentCollection,
  TorrentKeys,
} from '../../api';

const TORRENT_SORT_KEY = 'torrentListSortFilter';

const initialServerState = {} as ServerState;
const initialCategoryState: CategoryState = {};
const initialTorrentsState = { collection: {}, hashList: [], viewHashList: [] } as {
  collection: TorrentCollection;
  hashList: string[];
  viewHashList: string[];
};
const initialTorrentSortFilterState: SortFilterStateValue = {
  column: 'priority',
  asc: true,
  search: '',
  category: '__all__',
};

const ServerContext = createContext(initialServerState);
const CategoryContext = createContext(initialCategoryState);
const TorrentsContext = createContext(initialTorrentsState);
const TorrentHashListContext = createContext(initialTorrentsState.hashList);
const TorrentViewHashListContext = createContext(initialTorrentsState.viewHashList);
const TorrentSortFilterContext = createContext(([
  initialTorrentSortFilterState,
  undefined,
] as unknown) as SortFilterState);

export const AppContextProvider: FC = ({ children }) => {
  const intl = useIntl();
  const referenceId = useRef(0);
  const [sortFilterRefId, setSortFilterRefId] = useState(0);
  const [serverState, setServerState] = useState(initialServerState);
  const [categoryState, setCategoryState] = useState(initialCategoryState);
  const [torrentsState, setTorrentsState] = useState(initialTorrentsState);
  const [torrentSortFilterState, setTorrentSortState] = useState(
    unsafeMutateDefaults(initialTorrentSortFilterState)(
      storageGet(TORRENT_SORT_KEY, {} as SortFilterStateValue)
    )
  );
  const torrentSortFilterStateRef = useRef(torrentSortFilterState);
  const categoryStateRef = useRef(categoryState);

  const handleListSortFilter = useCallback<SortFilterHandler>(payload => {
    setTorrentSortState(s => {
      const { column, search, category } = payload;

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
        if (category != null) {
          draft.category = category;
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
      const {
        rid,
        full_update,
        torrents = {},
        torrents_removed,
        server_state,
        categories,
        categories_removed,
      } = sync;

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
        const updatedCategories: Record<string, [string, boolean][]> = {};
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
                    const [key, value] = item as [TorrentKeys, unknown];
                    if (key === 'category' && currentItem.category !== value && typeof value === 'string') {
                      const oldCategoryName = getNormalizedCategory(currentItem.category);
                      const newCategoryName = getNormalizedCategory(value);
                      const newCategorySet = updatedCategories[newCategoryName] || [];
                      const oldCategorySet = updatedCategories[oldCategoryName] || [];

                      newCategorySet.push([currentItem.hash, true]);
                      oldCategorySet.push([currentItem.hash, false]);

                      updatedCategories[oldCategoryName] = oldCategorySet;
                      updatedCategories[newCategoryName] = newCategorySet;
                    }
                    if (key === torrentSortFilterStateRef.current.column) {
                      shouldUpdateHashOrder = true;
                    }
                    currentItem[key] = value as never;
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

        // Set category state
        if (full_update) {
          const updatedInitialCategoryState: CategoryState = Object.values(
            torrents as Record<string, Torrent>
          ).reduce((acc, torrent) => {
            const { hash, category: categoryStr } = torrent;

            const category: Category | undefined = categoryStr !== '' ? acc[categoryStr] : acc['__none__'];

            if (category) {
              category.hashList.push(hash);
            }
            acc['__all__'].hashList.push(hash);
            return acc;
          }, getInitialCategories(intl, categories));

          setCategoryState(updatedInitialCategoryState);
        } else {
          if (Object.keys(updatedCategories).length > 0 || categories_removed) {
            setCategoryState(s => {
              const value = produce(s, draft => {
                if (categories_removed) {
                  categories_removed.forEach(categoryName => {
                    delete draft[categoryName];
                  });
                }
                const oldCategories = Object.values(draft);
                const newCategories = Object.values(categories || {}).map(buildCategory);
                oldCategories.concat(newCategories).forEach(category => {
                  const categoryName = getCategoryName(category);
                  const updates = updatedCategories[categoryName];
                  if (updates && updates.length > 0) {
                    updates.forEach(([hash, isAdding]) => {
                      const currentIndex = category.hashList.indexOf(hash);
                      if (isAdding && currentIndex < 0) {
                        category.hashList.push(hash);
                      } else if (!isAdding && currentIndex >= 0) {
                        category.hashList.splice(currentIndex, 1);
                      }
                    });
                  }
                  draft[categoryName] = category;
                });
              });

              setSortFilterRefId(Date.now());

              return value;
            });
          }
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
    categoryStateRef.current = categoryState;
  });

  useEffect(() => {
    torrentSortFilterStateRef.current = torrentSortFilterState;

    setTorrentsState(s => {
      const result = produce(s, draft => {
        draft.viewHashList = toHashList(
          sortAndFilter(torrentSortFilterState, Object.values(s.collection), categoryStateRef.current)
        );
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
              <CategoryContext.Provider value={categoryState}>{children}</CategoryContext.Provider>
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

export const useCategories = () => {
  return useContext(CategoryContext);
};
