import { FC } from 'react';
import { useIntl } from 'react-intl';
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

const useStyles = mStyles(({ spacing, palette }) => ({
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
  const classes = useStyles();
  const intl = useIntl();
  const [{ torrentListSelection }] = useUiState();
  const { mutate: executeOperation } = useTorrentsBasicActionMutation({
    onError: (err: unknown) => {
      console.log('error', err);
      return Promise.resolve();
    },
  });

  const getHandleButtonClick = (action: HeaderActions) => {
    return () => {
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
            onClick={getHandleButtonClick('resume')}
          >
            <PlayArrowIcon />
          </IconButton>
          <IconButton
            color="inherit"
            disabled={torrentListSelection.length <= 0}
            onClick={getHandleButtonClick('pause')}
          >
            <PauseIcon />
          </IconButton>
          <IconButton
            color="inherit"
            disabled={torrentListSelection.length <= 0}
            onClick={getHandleButtonClick('topPrio')}
          >
            <FirstPageIcon className="qbt--icon" />
          </IconButton>
          <IconButton
            color="inherit"
            disabled={torrentListSelection.length <= 0}
            onClick={getHandleButtonClick('increasePrio')}
          >
            <ChevronLeftIcon className="qbt--icon" />
          </IconButton>
          <IconButton
            color="inherit"
            disabled={torrentListSelection.length <= 0}
            onClick={getHandleButtonClick('decreasePrio')}
          >
            <ChevronRightIcon className="qbt--icon" />
          </IconButton>
          <IconButton
            color="inherit"
            disabled={torrentListSelection.length <= 0}
            onClick={getHandleButtonClick('bottomPrio')}
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
