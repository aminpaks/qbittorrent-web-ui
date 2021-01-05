import produce from 'immer';
import { FC, memo, MouseEventHandler, useCallback, useEffect, useState } from 'react';
import { MenuItem, Popover } from '../materialUiCore';
import { mStyles } from '../common';
import { ContextAction } from './types';
import { getElementAttr } from '../../utils';
import { FormattedMessage } from 'react-intl';

const useStyles = mStyles(({ spacing }) => ({
  popoverWrapper: {
    margin: 0,
    padding: 0,
    paddingTop: spacing(1),
    paddingBottom: spacing(1),
  },
}));

export const TorrentContextMenu: FC<{
  isOpen: boolean;
  mainActions: [ContextAction, ContextAction];
  onAction: (action: ContextAction) => void;
}> = memo(({ isOpen, mainActions, onAction }) => {
  const classes = useStyles();
  const [state, setState] = useState({ top: 0, left: 0 });

  const handleClick: MouseEventHandler = useCallback(
    event => {
      event.preventDefault();
      event.stopPropagation();

      onAction(getElementAttr('data-action', 'invalid' as ContextAction, event.currentTarget));
    },
    [onAction]
  );

  useEffect(() => {
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
        }
      }
    }

    document.addEventListener('mousedown', handleEvent);
    return () => {
      document.removeEventListener('mousedown', handleEvent);
    };
  }, [isOpen, onAction]);

  return (
    <Popover keepMounted open={isOpen} anchorPosition={state} anchorReference="anchorPosition">
      <ul className={classes.popoverWrapper}>
        <MenuItem onClick={handleClick} data-action={mainActions[0]}>
          {mainActions[0] === 'resume' ? (
            <FormattedMessage defaultMessage="Resume" />
          ) : (
            <FormattedMessage defaultMessage="Pause" />
          )}
        </MenuItem>
        <MenuItem divider onClick={handleClick} data-action={mainActions[1]}>
          {mainActions[1] === 'setForceStart' ? (
            <FormattedMessage defaultMessage="Force Resume" />
          ) : (
            <FormattedMessage defaultMessage="Pause" />
          )}
        </MenuItem>

        {/* <MenuItem divider onClick={handleClick} data-action="delete">
          <FormattedMessage defaultMessage="Delete" />
        </MenuItem>

        <MenuItem onClick={handleClick} data-action="setLocation">
          <FormattedMessage defaultMessage="Set location" />
        </MenuItem>
        <MenuItem divider onClick={handleClick} data-action="rename">
          <FormattedMessage defaultMessage="Rename" />
        </MenuItem> */}

        <MenuItem onClick={handleClick}>
          <FormattedMessage defaultMessage="Close Context Menu [x]" />
        </MenuItem>
      </ul>
    </Popover>
  );
});
