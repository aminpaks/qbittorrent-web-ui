import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useTorrentsState } from '../State';
import { getContextMenuMainOperations, getRowData } from './utils';
import { TorrentList } from './List';
import { CellTargetHandler, ContextAction } from './types';
import { TorrentContextMenu } from './contextMenu';
import { useTorrentsBasicActionMutation } from '../Data';

export const TorrentsContainer: FC = () => {
  const torrents = useTorrentsState();
  const torrentsRef = useRef(torrents.collection);
  const [contextMenuState, setContextMenuState] = useState({
    hash: null as string | null,
    isOpen: false,
    mainActions: ['invalid', 'invalid'] as [ContextAction, ContextAction],
  });
  const { isOpen, mainActions } = contextMenuState;
  const stateRef = useRef(contextMenuState);

  const { mutate: basicAction } = useTorrentsBasicActionMutation();

  const handleActionMenuStateReset = useCallback(() => {
    setContextMenuState(s => ({
      hash: null,
      isOpen: false,
      mainActions: s.mainActions,
    }));
  }, []);

  const handleActionItemClick = useCallback(
    (action: ContextAction) => {
      if (action !== 'invalid') {
        const { hash } = stateRef.current;
        if (hash && torrentsRef.current[hash]) {
          if (action === 'setForceStart') {
            basicAction({ list: [hash], params: [action, { value: true }] });
          } else if (action === 'setSuperSeeding') {
            basicAction({ list: [hash], params: [action, { value: false }] });
          } else if (action === 'setAutoManagement') {
          } else if (action === 'delete') {
          } else {
            basicAction({ list: [hash], params: [action] });
          }
        }
      }

      handleActionMenuStateReset();
    },
    [basicAction]
  );
  const handleActionMenuOpen: CellTargetHandler = useCallback(element => {
    const { hash = '' } = getRowData(element);
    if (hash && torrentsRef.current[hash]) {
      const { state } = torrentsRef.current[hash];
      const mainActions = getContextMenuMainOperations(state);

      setContextMenuState({ hash, mainActions, isOpen: true });
    }
  }, []);

  useEffect(() => {
    stateRef.current = contextMenuState;
    torrentsRef.current = torrents.collection;
  });

  useEffect(() => {
    function handler({ isTrusted }: Event) {
      if (isTrusted) {
        handleActionMenuStateReset();
      }
    }

    document.addEventListener('click', handler);
    return () => {
      document.removeEventListener('click', handler);
    };
  }, [handleActionMenuStateReset]);

  return (
    <>
      <TorrentList onMenuOpen={handleActionMenuOpen} />

      <TorrentContextMenu isOpen={isOpen} mainActions={mainActions} onAction={handleActionItemClick} />
    </>
  );
};
