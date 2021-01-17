import React, { Fragment, useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '../material-ui-core';
import { FormattedMessage, FormattedPlural } from 'react-intl';
import { usePersistentSelectedTorrents, useUiState } from '../state';
import { useTorrentsOperationMutation } from '../data';
import { useNotifications } from '../notifications';
import { getNotificationForContextOps } from './utils';

export const TorrentLimitRateDialog = () => {
  const [
    {
      limitRateDialog: { kind, isOpen },
    },
    { updateLimitRateDialogOpen, updateTorrentSelectionList },
  ] = useUiState();
  const { create } = useNotifications();
  const [newLimitRate, setNewLimitRate] = useState(0);
  const [limitRateUnit, setLimitRateUnit] = useState('k' as 'k' | 'm');
  const [selectedTorrents, persistSelectedTorrents] = usePersistentSelectedTorrents();
  const { mutate: executeOperation, isLoading, status, reset } = useTorrentsOperationMutation({
    onSuccess: response => {
      if (response === true) {
        updateLimitRateDialogOpen({ value: false });
        updateTorrentSelectionList({ type: 'only', list: [] });
        create({
          message: getNotificationForContextOps(
            kind === 'download' ? 'setDownloadLimit' : 'setUploadLimit',
            selectedTorrents
          ),
        });
      }
      return Promise.resolve();
    },
  });

  const handleLimitRateChange = () => {
    persistSelectedTorrents();
    executeOperation({
      list: selectedTorrents.map(({ hash }) => hash),
      params: [
        kind === 'download' ? 'setDownloadLimit' : 'setUploadLimit',
        { limit: newLimitRate > 0 ? newLimitRate * 1024 : -1 },
      ],
    });
  };

  const currentLimitRate =
    (selectedTorrents.length === 1
      ? kind === 'download'
        ? selectedTorrents[0]?.dl_limit
        : selectedTorrents[0]?.up_limit
      : 0) ?? 0;

  // Only update the initial value when mutation is in idle state
  useEffect(() => {
    if (isOpen) {
      if (status === 'idle') {
        setNewLimitRate(s => {
          if (selectedTorrents.length > 1) {
            return 0;
          } else if (currentLimitRate > 0) {
            return currentLimitRate / 1024;
          }
          return s;
        });
      }
    } else {
      setNewLimitRate(0);
      if (status === 'success') {
        reset();
        persistSelectedTorrents(false);
      }
    }
  }, [status, isOpen, currentLimitRate, selectedTorrents]);

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={isOpen}
      onClose={() => {
        updateLimitRateDialogOpen({ value: false });
      }}
    >
      <DialogTitle>
        <FormattedMessage
          defaultMessage="Update {type} limit rate"
          values={{
            type:
              kind === 'download' ? (
                <FormattedMessage defaultMessage="download" />
              ) : (
                <FormattedMessage defaultMessage="upload" />
              ),
          }}
        />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <FormattedMessage
            defaultMessage="Set a new limit rate for {itemCount}:"
            values={{
              itemCount: (
                <FormattedPlural value={selectedTorrents.length} one="this item" other="these items" />
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
            value={newLimitRate <= 0 ? 'unlimited' : 'limited'}
            onChange={({ target }) => {
              if (target.value === 'unlimited') {
                setNewLimitRate(0);
              } else {
                setNewLimitRate(currentLimitRate > 0 ? currentLimitRate / 1024 : 10);
              }
            }}
          >
            <FormControlLabel
              value="limited"
              control={<Radio />}
              label={<FormattedMessage defaultMessage="Limited" />}
            />
            <FormControlLabel
              value="unlimited"
              control={<Radio />}
              label={<FormattedMessage defaultMessage="Unlimited" />}
            />
          </RadioGroup>
        </FormControl>
        {newLimitRate > 0 ? (
          <>
            <TextField
              type="number"
              value={newLimitRate}
              onKeyDown={({ key }) => {
                if (key === 'Enter') {
                  handleLimitRateChange();
                }
              }}
              onChange={event => {
                event.preventDefault();
                event.stopPropagation();
                setNewLimitRate(Number.parseInt(event.target.value, 10));
              }}
            />
            <FormControl>
              <Select
                value={limitRateUnit}
                onChange={({ target }) => {
                  let value = target.value as 'k' | 'm';
                  if (value !== 'k' && value !== 'm') {
                    value = 'k';
                  }
                  setLimitRateUnit(s => {
                    if (s !== value) {
                      switch (value) {
                        case 'k':
                          setNewLimitRate(rm => rm * 1024);
                          break;
                        case 'm':
                          setNewLimitRate(rm => Math.max(rm / 1024, 1));
                          break;
                        default:
                          break;
                      }
                      return value;
                    }
                    return s;
                  });
                }}
              >
                <MenuItem value="k">
                  KiB<small>/s</small>
                </MenuItem>
                <MenuItem value="m">
                  MiB<small>/s</small>
                </MenuItem>
              </Select>
            </FormControl>
          </>
        ) : null}

        <DialogActions>
          <Button
            disabled={isLoading}
            onClick={() => {
              updateLimitRateDialogOpen({ value: false });
            }}
          >
            <FormattedMessage defaultMessage="Cancel" />
          </Button>
          <Button disabled={isLoading} color="primary" variant="contained" onClick={handleLimitRateChange}>
            <FormattedMessage defaultMessage="Update" />
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
