import { ChangeEventHandler, FC, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { mStyles } from '../common';
import { useTorrentsOperationMutation } from '../data';
import { Box, IconButton, Input, InputAdornment, Typography } from '../material-ui-core';
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

const useStyles = mStyles(({ spacing, breakpoints }) => ({
  headerRoot: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing(1),
    '& > div': {
      display: 'flex',
      flex: '0 0 auto',
      paddingLeft: spacing(1),
      paddingRight: spacing(1),
      [breakpoints.down('sm')]: {
        flex: '1 0 auto',
      },
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
  headerTitle: {
    [breakpoints.down('sm')]: {
      margin: '0 auto',
      '& .MuiTypography-root': {
        fontSize: '1.2rem',
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

  langContainer: {
    paddingTop: spacing(1),
    paddingBottom: spacing(1),
    [breakpoints.down('sm')]: {
      '& > div': {
        marginLeft: 'auto',
      },
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
      console.log('Please report this error', err);
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
        <div className={classes.headerTitle}>
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
      <div className={classes.langContainer}>
        <div>Lang: {intl.locale}</div>
      </div>
    </div>
  );
};
