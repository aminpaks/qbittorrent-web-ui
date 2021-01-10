import produce from 'immer';
import { FC, memo, MouseEventHandler, useCallback, useEffect, useState } from 'react';
import { Popover, List, ListItem, ListItemText, ListItemIcon } from '../material-ui-core';
import { mStyles } from '../common';
import { ContextAction } from './types';
import { getElementAttr, getVisibilityCompatibleKeys } from '../../utils';
import { Torrent } from '../../api';
import {
  getContextMenuActionIcon,
  getContextMenuActionProps,
  getContextMenuActionString,
  getContextMenuMainOperations,
} from './utils';

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

export const TorrentContextMenu: FC<
  {
    isOpen: boolean;
    onAction: (action: ContextAction) => void;
  } & Partial<Torrent>
> = memo(({ isOpen, onAction, ...rest }) => {
  const classes = useStyles();
  const [state, setState] = useState({ top: 0, left: 0 });
  const torrent = rest as Partial<Torrent>;
  const actions = getContextMenuMainOperations(torrent);

  const handleClick: MouseEventHandler = useCallback(
    event => {
      event.preventDefault();
      event.stopPropagation();

      onAction(getElementAttr('data-action', 'noop' as ContextAction, event.currentTarget));
    },
    [onAction]
  );

  useEffect(() => {
    const [hidden, visibilityChange] = getVisibilityCompatibleKeys();

    function handleEvent(e: Event) {
      if (e.isTrusted) {
        if (e.type === 'mousedown') {
          const { clientX: left, clientY: top } = e as MouseEvent;
          if (!isOpen) {
            setState(s =>
              produce(s, draft => {
                draft.top = top;
                draft.left = left;
              })
            );
          }
        } else if (e.type === 'keyup') {
          onAction('noop');
        } else if (e.type === visibilityChange) {
          if ((document as any)[hidden]) {
            onAction('noop');
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
  }, [isOpen, onAction]);

  return (
    <Popover keepMounted open={isOpen} anchorPosition={state} anchorReference="anchorPosition">
      <List dense className={classes.listRoot}>
        {actions.map(
          action =>
            action !== 'noop' && (
              <ListItem
                button
                key={action}
                className={classes.listItem}
                {...getContextMenuActionProps(action, torrent)}
                data-action={action}
                onClick={handleClick}
              >
                <ListItemIcon className="listitem-icon">
                  {getContextMenuActionIcon(action, torrent)}
                </ListItemIcon>
                <ListItemText primary={getContextMenuActionString(action)} />
              </ListItem>
            )
        )}
      </List>
    </Popover>
  );
});
