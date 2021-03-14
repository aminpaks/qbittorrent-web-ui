import produce from 'immer';
import { useIntl } from 'react-intl';
import { FC, memo, MouseEventHandler, useCallback, useEffect, useState } from 'react';
import { mStyles } from '../common';
import { Popover, List, ListItem, ListItemText, ListItemIcon } from '../material-ui-core';
import { getElementAttr, getVisibilityCompatibleKeys, tryCatchSync } from '../../utils';
import {
  getContextMenuOperationIcon,
  getOperationDivider,
  getContextMenuActionString,
  getContextOperations,
} from './utils';
import { ContextOps } from '../types';
import { useTorrentsState, useUiState } from '../state';
import { copyTorrentPropToClipboard, getNotificationForContextOps } from './utils';
import { useTorrentsOperationMutation } from '../data';
import { useNotifications } from '../notifications';

const useStyles = mStyles(({ spacing }) => ({
  popoverRoot: {
    bottom: 'auto !important',
    height: 'var(--height) !important',
  },
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

export const TorrentContextMenu: FC = memo(() => {
  const classes = useStyles();
  const [state, setState] = useState({ top: 0, left: 0 });
  const { formatMessage } = useIntl();
  const { create } = useNotifications();
  const torrentsState = useTorrentsState();
  const [
    {
      torrentListSelection,
      contextMenu: { isOpen },
    },
    {
      updateContextMenuIsOpen,
      updateDeleteConfirmationDialogIsOpen,
      updateSetLocationDialogIsOpen,
      updateRenameDialogIsOpen,
      updateLimitRateDialogOpen,
      updateShareLimitDialogOpen,
    },
  ] = useUiState();
  const selectedTorrents = torrentListSelection.map(hash => torrentsState.collection[hash] || { hash });
  const ops = getContextOperations(selectedTorrents);

  const { mutate: basicAction } = useTorrentsOperationMutation();

  const handleClick: MouseEventHandler = useCallback(
    event => {
      event.preventDefault();
      event.stopPropagation();

      const action = getElementAttr('data-action', 'noop' as ContextOps, event.currentTarget);
      const actionValue = tryCatchSync(
        () => JSON.parse(getElementAttr('data-action-value', 'false', event.currentTarget)) as boolean,
        false
      );

      if (action !== 'noop') {
        const list = selectedTorrents.map(({ hash }) => hash);

        switch (action) {
          case 'setForceStart': {
            basicAction({ list, params: [action, { value: actionValue }] });
            create({
              message: formatMessage(
                {
                  defaultMessage: `Force resume <b>activated</b> on
                    {itemCount, plural,
                      one {# item}
                      other {# items}
                    }`,
                },
                {
                  itemCount: list.length,
                  b: str => <b>{str}</b>,
                }
              ),
            });
            break;
          }

          case 'setSuperSeeding': {
            basicAction({ list, params: [action, { value: actionValue }] });
            create({
              message: formatMessage(
                {
                  defaultMessage: `Super seed <b>{state}</b> on
                  {itemCount, plural,
                    one {# item}
                    other {# items}
                  }`,
                },
                {
                  itemCount: selectedTorrents.filter(({ progress }) => progress === 1).length,
                  state: actionValue
                    ? formatMessage({ defaultMessage: 'activated' })
                    : formatMessage({ defaultMessage: 'disactivated' }),
                  b: chunk => <b>{chunk}</b>,
                }
              ),
            });
            break;
          }

          case 'setAutoManagement': {
            basicAction({ list, params: [action, { enable: actionValue }] });
            create({
              message: formatMessage(
                {
                  defaultMessage: `Auto management <b>{state}</b> on
                  {itemCount, plural,
                    one {# item}
                    other {# items}
                  }`,
                },
                {
                  itemCount: list.length,
                  state: actionValue
                    ? formatMessage({ defaultMessage: 'activated' })
                    : formatMessage({ defaultMessage: 'disactivated' }),
                  b: chunk => <b>{chunk}</b>,
                }
              ),
            });
            break;
          }

          case 'resume':
          case 'pause':
          case 'recheck':
          case 'reannounce':
          case 'toggleSequentialDownload':
          case 'toggleFirstLastPiecePrio': {
            basicAction({ list, params: [action] });
            create({ message: getNotificationForContextOps(action, selectedTorrents) });
            break;
          }

          case 'copyName':
          case 'copyHash':
          case 'copyMagnetLink': {
            copyTorrentPropToClipboard(action, selectedTorrents);
            create({ message: getNotificationForContextOps(action, selectedTorrents) });
            break;
          }

          case 'delete': {
            updateDeleteConfirmationDialogIsOpen({ value: true });
            break;
          }

          case 'setLocation': {
            updateSetLocationDialogIsOpen({ value: true });
            break;
          }

          case 'rename': {
            updateRenameDialogIsOpen({ value: true });
            break;
          }

          case 'setDownloadLimit':
          case 'setUploadLimit': {
            updateLimitRateDialogOpen({
              kind: action === 'setDownloadLimit' ? 'download' : 'upload',
              value: true,
            });
            break;
          }

          case 'setShareLimits': {
            updateShareLimitDialogOpen({ value: true });
            break;
          }

          default:
            console.log('Action not implemented', action);
            create({ message: `"${action}" action not implemented yet!`, severity: 'warning' });
            break;
        }
      }

      updateContextMenuIsOpen({ value: false });
    },
    [selectedTorrents]
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

  return (
    <Popover
      classes={{ root: classes.popoverRoot }}
      keepMounted
      open={isOpen}
      anchorPosition={state}
      anchorReference="anchorPosition"
    >
      <List dense className={classes.listRoot}>
        {ops.map(
          (operation, index, all) =>
            operation[0] !== 'noop' && (
              <ListItem
                button
                key={operation[0]}
                className={classes.listItem}
                divider={getOperationDivider(all[index + 1]?.[0], operation[0], all[index + 2]?.[0])}
                data-action={operation[0]}
                data-action-value={String(!operation[1])}
                onClick={handleClick}
              >
                <ListItemIcon className="listitem-icon">
                  {getContextMenuOperationIcon(operation)}
                </ListItemIcon>
                <ListItemText primary={getContextMenuActionString(operation[0])} />
              </ListItem>
            )
        )}
      </List>
    </Popover>
  );
});
