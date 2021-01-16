import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '../material-ui-core';
import { FormattedMessage, FormattedPlural } from 'react-intl';
import { useTorrentsState, useUiState } from '../state';
import { useTorrentsOperationMutation } from '../data';
import { useNotifications } from '../notifications';
import { getNotificationForContextOps } from './utils';
import { usePersistentMemo } from '../utils';

export const TorrentSetLocation = () => {
  const [
    {
      torrentListSelection,
      setLocation: { isOpen },
    },
    { updateSetLocationDialogIsOpen, updateTorrentSelectionList },
  ] = useUiState();
  const { create } = useNotifications();
  const { collection, hashList } = useTorrentsState();
  const [newLocation, setNewLocation] = useState('');

  const [selectedTorrents, persistSelectedTorrent] = usePersistentMemo(
    () => torrentListSelection.map(hash => collection[hash] ?? { hash }),
    [torrentListSelection, hashList]
  );

  const { mutate: basicAction, isLoading, status, reset } = useTorrentsOperationMutation({
    onSuccess: response => {
      if (response === true) {
        updateTorrentSelectionList({ type: 'only', list: [] });
        updateSetLocationDialogIsOpen({ value: false });
        create({ message: getNotificationForContextOps('setLocation', selectedTorrents) });
      }
      return Promise.resolve();
    },
  });

  // Only update the initial value when mutation is idle
  useEffect(() => {
    if (isOpen) {
      if (status === 'idle') {
        setNewLocation(s => selectedTorrents[0]?.save_path ?? s);
      }
    } else {
      if (status !== 'idle') {
        reset();
        persistSelectedTorrent(false);
      }
    }
  }, [selectedTorrents, status, isOpen]);

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        updateSetLocationDialogIsOpen({ value: false });
      }}
    >
      <DialogTitle>
        <FormattedMessage defaultMessage="Update location" />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <FormattedMessage
            defaultMessage="Set a new location for {itemCount}:"
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

        <TextField
          label="New location"
          value={newLocation}
          style={{ minWidth: 400 }}
          onChange={event => {
            event.preventDefault();
            event.stopPropagation();
            setNewLocation(event.target.value);
          }}
        />

        <DialogActions>
          <Button
            disabled={isLoading}
            onClick={() => {
              updateSetLocationDialogIsOpen({ value: false });
            }}
          >
            <FormattedMessage defaultMessage="Cancel" />
          </Button>
          <Button
            disabled={isLoading}
            color="primary"
            variant="contained"
            onClick={() => {
              persistSelectedTorrent();
              basicAction({
                list: torrentListSelection,
                params: ['setLocation', { location: newLocation }],
              });
            }}
          >
            <FormattedMessage defaultMessage="Update" />
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
