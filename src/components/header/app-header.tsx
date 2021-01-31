import { ChangeEventHandler, FC, KeyboardEventHandler, MouseEventHandler, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { mStyles } from '../common';
import { useTorrentsOperationMutation } from '../data';
import {
  Typography,
  Box,
  IconButton,
  Input,
  InputLabel,
  TextField,
  InputAdornment,
} from '../material-ui-core';
import {
  AddIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FirstPageIcon,
  LastPageIcon,
  PauseIcon,
  PlayArrowIcon,
  SearchIcon,
} from '../material-ui-icons';
import { useTorrentSortFilterState, useUiState } from '../state';
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

  searchInput: {
    color: '#fff',
    '&.MuiInput-underline:before': {
      borderBottomColor: 'rgba(255, 255, 255, 0.5)',
    },
    '&.MuiInput-underline:hover:not(.Mui-disabled):before': {
      borderBottomColor: '#fff',
    },
  },
}));

export const AppHeader: FC<{ qbtVersion: string }> = ({ qbtVersion }) => {
  const classes = useStyles();
  const intl = useIntl();
  const [{ torrentListSelection }, { updateAddNewDialogOpen }] = useUiState();
  const [{ search }, updateSortFilter] = useTorrentSortFilterState();
  const { mutate: executeOperation } = useTorrentsOperationMutation({
    onError: (err: unknown) => {
      console.log('error', err);
    },
  });

  const handleSearchInputChange = useMemo((): ChangeEventHandler<HTMLInputElement> => {
    let toHandle: number | undefined;

    return ({ target }) => {
      if (toHandle) {
        window.clearTimeout(toHandle);
        toHandle = undefined;
      }
      toHandle = window.setTimeout(() => updateSortFilter({ search: target.value }), 500);
    };
  }, []);

  const getHandleButtonClick = (action: HeaderActions) => {
    return () => {
      switch (action) {
        case 'resume':
        case 'pause':
        case 'topPrio':
        case 'bottomPrio':
        case 'increasePrio':
        case 'decreasePrio':
          return executeOperation({ list: torrentListSelection, params: [action] });
        case 'add':
          updateAddNewDialogOpen({ value: true });
        default:
          console.log(action, torrentListSelection);
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
        <div>
          <IconButton color="inherit" onClick={getHandleButtonClick('add')}>
            <AddIcon />
          </IconButton>
        </div>
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
        <Input
          classes={{ root: classes.searchInput }}
          defaultValue={search}
          placeholder={intl.formatMessage({ defaultMessage: 'Search' })}
          endAdornment={
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          }
          onChange={handleSearchInputChange}
        />
      </div>
      <div>
        <Box>Language: {intl.locale}</Box>
      </div>
    </div>
  );
};
