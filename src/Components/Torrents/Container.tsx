import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useTorrentsState } from '../State';
import { copyTorrentPropToClipboard, getRowData } from './utils';
import { TorrentList } from './List';
import { CellTargetHandler, ContextAction } from './types';
import { TorrentContextMenu } from './contextMenu';
import { useTorrentsBasicActionMutation } from '../Data';
import { Torrent } from '../../api';

export const TorrentsContainer: FC = () => {
  const torrents = useTorrentsState();
  const torrentsRef = useRef(torrents.collection);
  const [contextMenuState, setContextMenuState] = useState({
    isOpen: false,
    torrent: undefined as Torrent | undefined,
  });
  const stateRef = useRef(contextMenuState);
  const { isOpen, torrent = {} as Torrent } = contextMenuState;

  const { mutate: basicAction } = useTorrentsBasicActionMutation();

  const handleActionMenuStateReset = useCallback(() => {
    setContextMenuState(s => ({
      isOpen: false,
      torrent: s.torrent,
    }));
  }, []);

  const handleActionItemClick = useCallback(
    (action: ContextAction) => {
      if (action !== 'noop') {
        const { hash } = stateRef.current.torrent ?? {};
        if (hash && torrentsRef.current[hash]) {
          const torrent = torrentsRef.current[hash];

          switch (action) {
            case 'setForceStart':
              basicAction({ list: [hash], params: [action, { value: true }] });
              break;
            case 'setSuperSeeding':
              basicAction({ list: [hash], params: [action, { value: !torrent.super_seeding }] });
              break;
            case 'setAutoManagement':
              basicAction({ list: [hash], params: [action, { enable: !torrent.auto_tmm }] });
              break;
            case 'resume':
            case 'pause':
            case 'recheck':
            case 'reannounce':
            case 'toggleSequentialDownload':
            case 'toggleFirstLastPiecePrio':
              basicAction({ list: [hash], params: [action] });
              break;
            case 'copyName':
            case 'copyHash':
            case 'copyMagnetLink':
              copyTorrentPropToClipboard(action, torrent);
              break;
            default:
              console.log('action', action);
              break;
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
      const torrent = torrentsRef.current[hash];

      if (torrent) {
        setContextMenuState({ isOpen: true, torrent });
      }
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

      <TorrentContextMenu isOpen={isOpen} {...torrent} onAction={handleActionItemClick} />
    </>
  );
};
