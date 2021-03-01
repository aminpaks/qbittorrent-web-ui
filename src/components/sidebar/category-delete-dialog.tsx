import { FormattedMessage } from 'react-intl';
import { useCategoryOperationsMutation } from '../data';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Button,
} from '../material-ui-core';
import { useNotifications } from '../notifications';
import { useUiState } from '../state';

export const CategoryDeleteDialog = () => {
  const [
    {
      category: {
        deleteConfirmationDialog: { isOpen, categories },
      },
    },
    { updateCategoryDeleteDialogOpen },
  ] = useUiState();
  const { create: createNotification } = useNotifications();

  const { mutate: operate, isLoading } = useCategoryOperationsMutation({
    onSuccess: result => {
      if (result) {
        updateCategoryDeleteDialogOpen({ value: false });
      }
      createNotification({
        message: result ? (
          <FormattedMessage
            defaultMessage="<strong>{category}</strong> category deleted"
            values={{
              strong: (chunk: string) => <strong>{chunk}</strong>,
              category: categories[0],
            }}
          />
        ) : (
          <FormattedMessage
            defaultMessage="Failure to delete '{category}'"
            values={{
              category: categories[0],
            }}
          />
        ),
        severity: result ? 'info' : 'error',
      });
    },
  });
  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        updateCategoryDeleteDialogOpen({ value: false });
      }}
    >
      <DialogTitle>
        <FormattedMessage defaultMessage="Delete confirmation" />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <FormattedMessage
            defaultMessage="Are you sure you wanna delete <strong>{item}</strong>?"
            values={{
              strong: (chunk: string) => <strong>{chunk}</strong>,
              item: categories[0],
            }}
          />
        </DialogContentText>

        <DialogActions>
          <Button
            disabled={isLoading}
            onClick={() => {
              updateCategoryDeleteDialogOpen({ value: false });
            }}
          >
            <FormattedMessage defaultMessage="Cancel" />
          </Button>
          <Button
            disabled={isLoading}
            color="primary"
            variant="contained"
            onClick={() => {
              operate(['delete', { categories: categories }]);
            }}
          >
            <FormattedMessage defaultMessage="Confirm" />
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
