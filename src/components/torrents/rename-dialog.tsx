import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '../material-ui-core';
import { FormattedMessage } from 'react-intl';
import { usePersistentSelectedTorrents, useUiState } from '../state';
import { useTorrentsOperationMutation } from '../data';
import { useNotifications } from '../notifications';
import { getNotificationForContextOps } from './utils';

export const TorrentRenameDialog = () => {
  const [
    {
      rename: { isOpen },
    },
    { updateRenameDialogIsOpen, updateTorrentSelectionList },
  ] = useUiState();
  const [newName, setNewName] = useState('');
  const { create } = useNotifications();

  const [selectedTorrents, persistSelectedTorrents] = usePersistentSelectedTorrents();

  const { mutate: basicAction, isLoading, status, reset } = useTorrentsOperationMutation({
    onSuccess: response => {
      if (response === true) {
        updateTorrentSelectionList({ type: 'only', list: [] });
        updateRenameDialogIsOpen({ value: false });
        create({ message: getNotificationForContextOps('rename', selectedTorrents) });
      }
      return Promise.resolve();
    },
  });

  const handleNameChange = () => {
    persistSelectedTorrents();
    basicAction({
      list: selectedTorrents.map(({ hash }) => hash),
      params: ['rename', { name: newName }],
    });
  };

  // Only update the initial value when mutation is idle
  useEffect(() => {
    if (isOpen) {
      if (status === 'idle') {
        setNewName(s => selectedTorrents[0]?.name ?? s);
      }
    } else {
      if (status !== 'idle') {
        reset();
        persistSelectedTorrents(false);
      }
    }
  }, [selectedTorrents, status, isOpen]);

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        updateRenameDialogIsOpen({ value: false });
      }}
    >
      <DialogTitle>
        <FormattedMessage defaultMessage="Update Name" />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <FormattedMessage defaultMessage="Set a new name for item below:" />
          <br />
          {selectedTorrents[0]?.name}
        </DialogContentText>

        <TextField
          autoFocus
          label={<FormattedMessage defaultMessage="New name" />}
          value={newName}
          style={{ minWidth: 400 }}
          onKeyDown={({ key }) => {
            if (key === 'Enter') {
              handleNameChange();
            }
          }}
          onChange={event => {
            event.preventDefault();
            event.stopPropagation();
            setNewName(event.target.value);
          }}
        />

        <DialogActions>
          <Button
            disabled={isLoading}
            onClick={() => {
              updateRenameDialogIsOpen({ value: false });
            }}
          >
            <FormattedMessage defaultMessage="Cancel" />
          </Button>
          <Button disabled={isLoading} color="primary" variant="contained" onClick={handleNameChange}>
            <FormattedMessage defaultMessage="Update" />
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
