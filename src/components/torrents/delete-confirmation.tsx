import { Fragment, useState } from 'react';
import { FormattedMessage, FormattedPlural } from 'react-intl';
import { storageGet, storageSet } from '../../utils';
import { useTorrentsBasicActionMutation } from '../data';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Button,
  Checkbox,
  Box,
  FormControlLabel,
} from '../material-ui-core';
import { useTorrentsState, useUiState } from '../state';

const HARD_DELETE_CHECK = 'deleteConfirmation.hardDelete';

export const DeleteConfirmation = () => {
  const [
    {
      torrentListSelection,
      deleteConfirmation: { isOpen },
    },
    { updateTorrentSelectionList, updateDeleteConfirmationDialogIsOpen },
  ] = useUiState();
  const { collection } = useTorrentsState();
  const names = torrentListSelection.map(hash => collection[hash]?.name);

  const [isHardDeleteChecked, setIsHardDeleteChecked] = useState(() => storageGet(HARD_DELETE_CHECK, false));

  const { mutate: basicAction, isLoading } = useTorrentsBasicActionMutation({
    onSuccess: response => {
      if (response === true) {
        updateTorrentSelectionList({ type: 'only', list: [] });
        updateDeleteConfirmationDialogIsOpen({ value: false });
      }
      return Promise.resolve();
    },
  });

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        updateDeleteConfirmationDialogIsOpen({ value: false });
      }}
    >
      <DialogTitle>
        <FormattedMessage defaultMessage="Delete confirmation" />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <FormattedMessage
            defaultMessage="Are you sure you wanna delete {itemCount}?"
            values={{
              itemCount: <FormattedPlural value={names.length} one="this item" other="these items" />,
            }}
          />
        </DialogContentText>

        <DialogContentText>
          {names.slice(0, 10).map(
            name =>
              name && (
                <Fragment key={name}>
                  <span>{name}</span>
                  <br />
                </Fragment>
              )
          )}
          {names.length > 10 && (
            <FormattedMessage
              defaultMessage="And {count} more items..."
              values={{ count: names.length - 10 }}
            />
          )}
        </DialogContentText>

        <FormControlLabel
          label={<FormattedMessage defaultMessage="Also delete from hard disk" />}
          control={
            <Checkbox
              onChange={() => {
                setIsHardDeleteChecked(val => storageSet(HARD_DELETE_CHECK, !val));
              }}
              checked={isHardDeleteChecked}
              color="primary"
            />
          }
        />
        <DialogActions>
          <Button
            disabled={isLoading}
            onClick={() => {
              updateDeleteConfirmationDialogIsOpen({ value: false });
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            color="primary"
            variant="contained"
            onClick={() => {
              basicAction({
                list: torrentListSelection,
                params: ['delete', { hardDelete: isHardDeleteChecked }],
              });
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
