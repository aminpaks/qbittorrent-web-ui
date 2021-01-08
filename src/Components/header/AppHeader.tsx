import { FC, MouseEventHandler, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { getElementAttr } from '../../utils';
import { mStyles } from '../common';
import { useTorrentsBasicActionMutation } from '../Data';
import { Typography, Box, IconButton } from '../materialUiCore';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  FirstPageIcon,
  LastPageIcon,
  PauseIcon,
  PlayArrowIcon,
} from '../materialUiIcons';
import { useUiState } from '../State';
import { HeaderActions } from './types';

const useHeaderStyles = mStyles(({ spacing, palette }) => ({
  headerRoot: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing(1),
    '& > div': {
      display: 'flex',
      flex: '0 0 auto',
      paddingLeft: spacing(1),
      paddingRight: spacing(1),
    },
    '& .qbt--icon': {
      transform: 'rotate(90deg)',
    },
    '& .MuiGrid-item': {
      display: 'flex',
      '& > *': {
        display: 'flex',
        flex: '0 0 auto',
        alignItems: 'center',
      },
    },
  },

  actionButtons: {
    marginRight: 'auto',
    '& .qbt--header--action-buttons-wrapper': {
      '& > button': {
        '& *': {
          pointerEvents: 'none',
        },
      },
    },
  },
}));

export const AppHeader: FC<{ qbtVersion: string }> = ({ qbtVersion }) => {
  const classes = useHeaderStyles();
  const intl = useIntl();
  const [{ torrentListSelection }] = useUiState();
  const { mutate: executeOperation } = useTorrentsBasicActionMutation({
    onError: (err: unknown) => {
      console.log('error', err);
      return Promise.resolve();
    },
  });

  const handleButtonClick: MouseEventHandler = ({ target }) => {
    const action = getElementAttr('data-action', 'noop' as HeaderActions, target as Element);

    console.log(action, torrentListSelection);
    switch (action) {
      case 'resume':
      case 'pause':
      case 'topPrio':
      case 'bottomPrio':
      case 'increasePrio':
      case 'decreasePrio':
        return executeOperation({ list: torrentListSelection, params: [action] });
      default:
        return;
    }
  };

  return (
    <div className={classes.headerRoot}>
      <div>
        <div>
          <Typography variant="body1">qBittorrent {qbtVersion}</Typography>
        </div>
      </div>
      <div className={classes.actionButtons}>
        <div className="qbt--header--action-buttons-wrapper">
          <IconButton
            color="inherit"
            disabled={torrentListSelection.length <= 0}
            data-action="resume"
            onClick={handleButtonClick}
          >
            <PlayArrowIcon />
          </IconButton>
          <IconButton
            color="inherit"
            disabled={torrentListSelection.length <= 0}
            data-action="pause"
            onClick={handleButtonClick}
          >
            <PauseIcon />
          </IconButton>
          <IconButton
            color="inherit"
            disabled={torrentListSelection.length <= 0}
            data-action="topPrio"
            onClick={handleButtonClick}
          >
            <FirstPageIcon className="qbt--icon" />
          </IconButton>
          <IconButton
            color="inherit"
            disabled={torrentListSelection.length <= 0}
            data-action="increasePrio"
            onClick={handleButtonClick}
          >
            <ChevronLeftIcon className="qbt--icon" />
          </IconButton>
          <IconButton
            color="inherit"
            disabled={torrentListSelection.length <= 0}
            data-action="decreasePrio"
            onClick={handleButtonClick}
          >
            <ChevronRightIcon className="qbt--icon" />
          </IconButton>
          <IconButton
            color="inherit"
            disabled={torrentListSelection.length <= 0}
            data-action="bottomPrio"
            onClick={handleButtonClick}
          >
            <LastPageIcon className="qbt--icon" />
          </IconButton>
        </div>
      </div>
      <div>
        <Box>Language: {intl.locale}</Box>
      </div>
    </div>
  );
};
