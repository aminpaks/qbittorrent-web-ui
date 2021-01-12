import produce from 'immer';
import { useIntl } from 'react-intl';
import { FC, memo, MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import { mStyles } from '../common';
import { Popover, List, ListItem, ListItemText, ListItemIcon } from '../material-ui-core';
import { getElementAttr, getVisibilityCompatibleKeys, pick } from '../../utils';
import { Torrent } from '../../api';
import { getContextMenuActionIcon, getContextMenuActionProps, getContextMenuActionString } from './utils';
import { ContextOps } from '../types';
import { useTorrentsState, useUiState } from '../state';
import { copyTorrentPropToClipboard, getNotificationForContextAction } from './utils';
import { useTorrentsBasicActionMutation } from '../data';
import { useNotifications } from '../notifications';

const useStyles = mStyles(({ spacing }) => ({
  popoverWrapper: {
    margin: 0,
    padding: 0,
    paddingTop: spacing(1),
    paddingBottom: spacing(1),
  },
  listRoot: {
    minWidth: 180,
    '& .listitem-icon': {
      minWidth: 30,
    },
  },
  listItem: {
    '& *': {
      pointerEvents: 'none',
    },
  },
}));

export const TorrentContextMenu: FC = memo(props => {
  const classes = useStyles();
  const [state, setState] = useState({ top: 0, left: 0 });
  const { formatMessage } = useIntl();
  const { create } = useNotifications();
  const torrentsState = useTorrentsState();
  const torrentsStateRef = useRef(torrentsState.collection);
  const [{ torrentListSelection, contextMenu }, { updateContextMenuIsOpen }] = useUiState();
  const { isOpen } = contextMenu;

  const [firstSelectedTorrentHash] = torrentListSelection;
  const selectedTorrent =
    torrentListSelection.length === 1 ? torrentsState.collection[firstSelectedTorrentHash] : ({} as Torrent);

  const { mutate: basicAction } = useTorrentsBasicActionMutation();

  const handleClick: MouseEventHandler = useCallback(
    event => {
      event.preventDefault();
      event.stopPropagation();

      const action = getElementAttr('data-action', 'noop' as ContextOps, event.currentTarget);

      console.log('action', action);
      if (action !== 'noop') {
        if (torrentListSelection.length > 0) {
          console.log('action', action, torrentListSelection);
          // const torrent = torrentsStateRef.current[hash];

          // switch (action) {
          //   case 'setForceStart':
          //     basicAction({ list: [hash], params: [action, { value: true }] });
          //     create({
          //       message: formatMessage(
          //         { defaultMessage: `Force resume activated for {name}` },
          //         { name: torrent.name }
          //       ),
          //     });
          //     break;
          //   case 'setSuperSeeding':
          //     const value = !torrent.super_seeding;
          //     basicAction({ list: [hash], params: [action, { value }] });
          //     create({
          //       message: formatMessage(
          //         { defaultMessage: `Super seed {state} for {name}` },
          //         {
          //           name: torrent.name,
          //           state: value ? (
          //             <strong>{formatMessage({ defaultMessage: 'activated' })}</strong>
          //           ) : (
          //             formatMessage({ defaultMessage: 'disactivated' })
          //           ),
          //         }
          //       ),
          //     });
          //     break;
          //   case 'setAutoManagement':
          //     const enable = !torrent.auto_tmm;
          //     basicAction({ list: [hash], params: [action, { enable }] });
          //     create({
          //       message: formatMessage(
          //         { defaultMessage: `Auto management {state} for {name}` },
          //         {
          //           name: torrent.name,
          //           state: enable
          //             ? formatMessage({ defaultMessage: 'activated' })
          //             : formatMessage({ defaultMessage: 'disactivated' }),
          //         }
          //       ),
          //     });
          //     break;
          //   case 'resume':
          //   case 'pause':
          //   case 'recheck':
          //   case 'reannounce':
          //   case 'toggleSequentialDownload':
          //   case 'toggleFirstLastPiecePrio':
          //     basicAction({ list: [hash], params: [action] });
          //     create({ message: getNotificationForContextAction(action, torrent) });
          //     break;
          //   case 'copyName':
          //   case 'copyHash':
          //   case 'copyMagnetLink':
          //     copyTorrentPropToClipboard(action, torrent);
          //     create({ message: getNotificationForContextAction(action, torrent) });
          //     break;
          //   default:
          //     console.log('Action not implemented', action);
          //     create({ message: `"${action}" action not implemented yet!`, severity: 'warning' });
          //     break;
          // }
        }
      }
    },
    [torrentListSelection]
  );

  useEffect(() => {
    const [hidden, visibilityChange] = getVisibilityCompatibleKeys();

    function handleEvent(e: Event) {
      if (e.isTrusted) {
        if (isOpen) {
          if (e.type === 'keyup') {
            updateContextMenuIsOpen({ value: false });
          } else if (e.type === visibilityChange) {
            if ((document as any)[hidden]) {
              updateContextMenuIsOpen({ value: false });
            }
          }
        } else {
          if (e.type === 'mousedown') {
            const { clientX: left, clientY: top } = e as MouseEvent;
            setState(s =>
              produce(s, draft => {
                draft.top = top;
                draft.left = left;
              })
            );
          }
        }
      }
    }

    document.addEventListener('mousedown', handleEvent);
    document.addEventListener('keyup', handleEvent);
    document.addEventListener(visibilityChange, handleEvent);
    return () => {
      document.removeEventListener('mousedown', handleEvent);
      document.removeEventListener('keyup', handleEvent);
      document.removeEventListener(visibilityChange, handleEvent);
    };
  }, [isOpen]);

  useEffect(() => {
    torrentsStateRef.current = torrentsState.collection;
  }, [torrentsState.collection]);

  return (
    <Popover keepMounted open={isOpen} anchorPosition={state} anchorReference="anchorPosition">
      <List dense className={classes.listRoot}>
        {contextMenu.ops.map(
          operation =>
            operation !== 'noop' && (
              <ListItem
                button
                key={operation}
                className={classes.listItem}
                {...getContextMenuActionProps(operation, selectedTorrent)}
                data-action={operation}
                onClick={handleClick}
              >
                <ListItemIcon className="listitem-icon">
                  {getContextMenuActionIcon(operation, selectedTorrent)}
                </ListItemIcon>
                <ListItemText primary={getContextMenuActionString(operation)} />
              </ListItem>
            )
        )}
      </List>
    </Popover>
  );
});
