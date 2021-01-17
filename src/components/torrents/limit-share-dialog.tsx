import React, { Fragment, useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from '../material-ui-core';
import { FormattedMessage } from 'react-intl';
import { usePersistentSelectedTorrents, useUiState } from '../state';
import { useTorrentsOperationMutation } from '../data';
import { useNotifications } from '../notifications';
import { getNotificationForContextOps } from './utils';
import { ShareLimitType } from './types';

const GLOBAL_SHARE_LIMIT = {
  ratio: -2,
  time: -2,
};
const NO_SHARE_LIMIT = {
  ratio: -1,
  time: -1,
};
const DEFAULT_LIMIT_STATE = { ratio: false, time: false };

export const TorrentShareLimitDialog = () => {
  const [
    {
      limitShareDialog: { isOpen },
    },
    { updateShareLimitDialogOpen, updateTorrentSelectionList },
  ] = useUiState();
  const { create } = useNotifications();
  const [newLimit, setNewLimit] = useState(GLOBAL_SHARE_LIMIT);
  const [limitState, setLimitState] = useState(DEFAULT_LIMIT_STATE);
  const [selectedTorrents, persistSelectedTorrents, allHashes] = usePersistentSelectedTorrents();
  const { mutate: executeOperation, isLoading, status, reset } = useTorrentsOperationMutation({
    onSuccess: response => {
      if (response === true) {
        updateShareLimitDialogOpen({ value: false });
        updateTorrentSelectionList({ type: 'only', list: [] });
        create({
          message: getNotificationForContextOps('setShareLimits', selectedTorrents),
        });
      }
      return Promise.resolve();
    },
  });

  const handleShareLimitChange = () => {
    const { ratio, time } = limitState;
    persistSelectedTorrents();
    executeOperation({
      list: selectedTorrents.length >= allHashes.length ? ['all'] : selectedTorrents.map(({ hash }) => hash),
      params: [
        'setShareLimits',
        { ratioLimit: ratio ? newLimit.ratio : -2, seedingTimeLimit: time ? newLimit.time : -2 },
      ],
    });
  };

  const currentRatioLimit = selectedTorrents.length > 1 ? -2 : selectedTorrents[0]?.ratio_limit;
  const currentTimeLimit = selectedTorrents.length > 1 ? -2 : selectedTorrents[0]?.seeding_time_limit;

  // Only update the initial value when mutation is in idle state
  useEffect(() => {
    if (isOpen) {
      if (status === 'idle') {
        const type = getSelectedLimitType(currentRatioLimit, currentTimeLimit);
        const ratio = currentRatioLimit > 0;
        const time = currentTimeLimit > 0;
        setLimitState({ ratio, time });
        setNewLimit(() => {
          switch (type) {
            case 'individual':
              return { ratio: currentRatioLimit, time: currentTimeLimit };
            case 'noLimit':
              return NO_SHARE_LIMIT;
            case 'globalLimit':
              return GLOBAL_SHARE_LIMIT;
          }
        });
      }
    } else {
      if (status === 'success') {
        reset();
        persistSelectedTorrents(false);
      }
    }
  }, [status, isOpen, currentRatioLimit, currentTimeLimit, selectedTorrents]);

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={isOpen}
      onClose={() => {
        updateShareLimitDialogOpen({ value: false });
      }}
    >
      <DialogTitle>
        <FormattedMessage defaultMessage="Update share limit ratio" />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <FormattedMessage
            defaultMessage="Set a new limit ratio for {itemCount}:"
            values={{
              itemCount:
                selectedTorrents.length === 1 ? (
                  <FormattedMessage defaultMessage="this item" />
                ) : (
                  <FormattedMessage defaultMessage="these items" />
                ),
            }}
          />
        </DialogContentText>
        <DialogContentText>
          {selectedTorrents.slice(0, 10).map(({ hash, name }) => (
            <Fragment key={hash}>
              <span>{name}</span>
              <br />
            </Fragment>
          ))}
          {selectedTorrents.length > 10 && (
            <FormattedMessage
              defaultMessage="And {count} more items..."
              values={{ count: selectedTorrents.length - 10 }}
            />
          )}
        </DialogContentText>

        <FormControl component="fieldset">
          <FormLabel component="legend" />
          <RadioGroup
            value={getSelectedLimitType(newLimit.ratio, newLimit.time)}
            onChange={({ target }) => {
              const value = target.value as ShareLimitType;
              switch (value) {
                case 'individual':
                  setNewLimit({
                    ratio: currentRatioLimit > 0 ? currentRatioLimit : 1,
                    time: currentTimeLimit > 0 ? currentTimeLimit : 60,
                  });
                  break;
                case 'noLimit':
                  setNewLimit(NO_SHARE_LIMIT);
                  setLimitState(DEFAULT_LIMIT_STATE);
                  break;
                case 'globalLimit':
                default:
                  setNewLimit(GLOBAL_SHARE_LIMIT);
                  setLimitState(DEFAULT_LIMIT_STATE);
                  break;
              }
            }}
          >
            <FormControlLabel
              value="globalLimit"
              control={<Radio />}
              label={<FormattedMessage defaultMessage="Global limit" />}
            />
            <FormControlLabel
              value="noLimit"
              control={<Radio />}
              label={<FormattedMessage defaultMessage="No limit" />}
            />
            <FormControlLabel
              value="individual"
              control={<Radio />}
              label={<FormattedMessage defaultMessage="Individual" />}
            />
          </RadioGroup>
        </FormControl>
        {newLimit.ratio >= 0 || newLimit.time >= 0 ? (
          <FormControl>
            <FormGroup>
              <FormControlLabel
                label={<span>Ratio (%)</span>}
                control={
                  <Checkbox
                    checked={limitState.ratio}
                    onChange={() => {
                      setLimitState(s => {
                        if (s.ratio === true) {
                          setNewLimit(l => ({ ...l, ratio: 1 }));
                        }
                        return { ...s, ratio: !s.ratio };
                      });
                    }}
                  />
                }
              />
              {limitState.ratio ? (
                <TextField
                  type="number"
                  value={newLimit.ratio >= 0 ? newLimit.ratio.toFixed(2) : '0.00'}
                  onKeyDown={({ key }) => {
                    if (key === 'Enter') {
                      handleShareLimitChange();
                    }
                  }}
                  onChange={({ target }) => {
                    setNewLimit(s => {
                      return { ...s, ratio: parseFloatOrElse(target.value, -2) };
                    });
                  }}
                />
              ) : null}

              <FormControlLabel
                label={<span>Time (minutes)</span>}
                control={
                  <Checkbox
                    checked={limitState.time}
                    onChange={() => {
                      setLimitState(s => {
                        if (s.time === true) {
                          setNewLimit(l => ({ ...l, time: 60 }));
                        }
                        return { ...s, time: !s.time };
                      });
                    }}
                  />
                }
              />
              {limitState.time ? (
                <TextField
                  type="number"
                  value={newLimit.time >= 0 ? newLimit.time.toFixed(0) : '0'}
                  onKeyDown={({ key }) => {
                    if (key === 'Enter') {
                      handleShareLimitChange();
                    }
                  }}
                  onChange={({ target }) => {
                    setNewLimit(s => ({ ...s, time: parseFloatOrElse(target.value, -2) }));
                  }}
                />
              ) : null}
            </FormGroup>
          </FormControl>
        ) : null}

        <DialogActions>
          <Button
            disabled={isLoading}
            onClick={() => {
              updateShareLimitDialogOpen({ value: false });
            }}
          >
            <FormattedMessage defaultMessage="Cancel" />
          </Button>
          <Button
            disabled={
              isLoading ||
              (getSelectedLimitType(newLimit.ratio, newLimit.time) === 'individual' &&
                limitState.ratio === false &&
                limitState.time === false)
            }
            color="primary"
            variant="contained"
            onClick={handleShareLimitChange}
          >
            <FormattedMessage defaultMessage="Update" />
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

function getSelectedLimitType(
  ratioLimit: number,
  timeLimit: number
): 'globalLimit' | 'noLimit' | 'individual' {
  if (ratioLimit >= 0 || timeLimit >= 0) {
    return 'individual';
  } else if (ratioLimit === -1 || timeLimit === -1) {
    return 'noLimit';
  }
  return 'globalLimit';
}

function parseFloatOrElse(i: string, fallback: number) {
  const value = Number.parseFloat(i);
  if (!Number.isNaN(value)) {
    return value;
  }
  return fallback;
}
