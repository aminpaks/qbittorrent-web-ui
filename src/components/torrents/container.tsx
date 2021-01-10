import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useTorrentsState } from '../state';
import { copyTorrentPropToClipboard, getNotificationForContextAction, getRowData } from './utils';
import { TorrentList } from './list';
import { CellTargetHandler, ContextAction } from './types';
import { TorrentContextMenu } from './context-menu';
import { useTorrentsBasicActionMutation } from '../data';
import { Torrent } from '../../api';
import { useNotifications } from '../notifications';

export const TorrentsContainer: FC = () => {
  const { formatMessage } = useIntl();
  const torrents = useTorrentsState();
  const { create } = useNotifications();
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
              create({
                message: formatMessage(
                  { defaultMessage: `Force resume activated for {name}` },
                  { name: torrent.name }
                ),
              });
              break;
            case 'setSuperSeeding':
              const value = !torrent.super_seeding;
              basicAction({ list: [hash], params: [action, { value }] });
              create({
                message: formatMessage(
                  { defaultMessage: `Super seed {state} for {name}` },
                  {
                    name: torrent.name,
                    state: value ? (
                      <strong>{formatMessage({ defaultMessage: 'activated' })}</strong>
                    ) : (
                      formatMessage({ defaultMessage: 'disactivated' })
                    ),
                  }
                ),
              });
              break;
            case 'setAutoManagement':
              const enable = !torrent.auto_tmm;
              basicAction({ list: [hash], params: [action, { enable }] });
              create({
                message: formatMessage(
                  { defaultMessage: `Auto management {state} for {name}` },
                  {
                    name: torrent.name,
                    state: enable
                      ? formatMessage({ defaultMessage: 'activated' })
                      : formatMessage({ defaultMessage: 'disactivated' }),
                  }
                ),
              });
              break;
            case 'resume':
            case 'pause':
            case 'recheck':
            case 'reannounce':
            case 'toggleSequentialDownload':
            case 'toggleFirstLastPiecePrio':
              basicAction({ list: [hash], params: [action] });
              create({ message: getNotificationForContextAction(action, torrent) });
              break;
            case 'copyName':
            case 'copyHash':
            case 'copyMagnetLink':
              copyTorrentPropToClipboard(action, torrent);
              create({ message: getNotificationForContextAction(action, torrent) });
              break;
            default:
              console.log('Action not implemented', action);
              create({ message: `"${action}" action not implemented yet!`, severity: 'warning' });
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
