import { ChangeEventHandler, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useCategoryOperationsMutation } from '../data';
import { Dialog, DialogContent, DialogTitle, DialogActions, Button, TextField } from '../material-ui-core';
import { useNotifications } from '../notifications';
import { useUiState } from '../state';

export const CategoryAddEditDialog = () => {
  const [
    {
      category: {
        addEditDialog: { isOpen, category: currentCategory },
      },
    },
    { updateCategoryAddEditDialogOpen },
  ] = useUiState();
  const { create: createNotification } = useNotifications();
  const [categoryState, setCategoryState] = useState({
    categoryName: '',
    savePath: '',
  });
  const isCreating = !currentCategory;

  const { mutate: operate, isLoading } = useCategoryOperationsMutation({
    onSuccess: result => {
      if (result) {
        updateCategoryAddEditDialogOpen({ value: false });
      }
      if (isCreating) {
        createNotification({
          message: result ? (
            <FormattedMessage
              defaultMessage="<strong>{category}</strong> category created"
              values={{
                strong: (chunk: string) => <strong>{chunk}</strong>,
                category: categoryState.categoryName,
              }}
            />
          ) : (
            <FormattedMessage
              defaultMessage="Fail to create '{category}'"
              values={{
                category: categoryState.categoryName,
              }}
            />
          ),
          severity: result ? 'info' : 'error',
        });
      } else {
        createNotification({
          message: result ? (
            <FormattedMessage
              defaultMessage="<strong>{category}</strong> category updated"
              values={{
                strong: (chunk: string) => <strong>{chunk}</strong>,
                category: categoryState.categoryName,
              }}
            />
          ) : (
            <FormattedMessage
              defaultMessage="Fail to update '{category}'"
              values={{
                category: categoryState.categoryName,
              }}
            />
          ),
          severity: result ? 'info' : 'error',
        });
      }
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (currentCategory) {
        const { name: categoryName, savePath } = currentCategory;
        setCategoryState({ categoryName, savePath });
      } else {
        setCategoryState({ categoryName: '', savePath: '' });
      }
    }
  }, [isOpen]);

  const handleCategoryAddEdit = () => {
    const { categoryName: category, savePath } = categoryState;
    operate([isCreating ? 'create' : 'edit', { category, savePath }]);
  };

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    setCategoryState(s => ({ ...s, [target.name]: target.value }));
  };

  const handleDialogClose = () => {
    updateCategoryAddEditDialogOpen({ value: false });
  };

  return (
    <Dialog open={isOpen} onClose={handleDialogClose}>
      <DialogTitle>
        {isCreating ? (
          <FormattedMessage defaultMessage="Create category" />
        ) : (
          <FormattedMessage defaultMessage="Modify category" />
        )}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          name="categoryName"
          label={<FormattedMessage defaultMessage="Category Name" />}
          value={categoryState.categoryName}
          style={{ minWidth: 400 }}
          disabled={!isCreating}
          onKeyDown={({ key }) => {
            if (key === 'Enter') {
              handleCategoryAddEdit();
            }
          }}
          onChange={handleInputChange}
        />
        <TextField
          name="savePath"
          label={<FormattedMessage defaultMessage="Path to store torrents" />}
          value={categoryState.savePath}
          style={{ minWidth: 400 }}
          onKeyDown={({ key }) => {
            if (key === 'Enter') {
              handleCategoryAddEdit();
            }
          }}
          onChange={handleInputChange}
        />

        <DialogActions>
          <Button disabled={isLoading} onClick={handleDialogClose}>
            <FormattedMessage defaultMessage="Cancel" />
          </Button>
          <Button disabled={isLoading} color="primary" variant="contained" onClick={handleCategoryAddEdit}>
            {isCreating ? (
              <FormattedMessage defaultMessage="Create" />
            ) : (
              <FormattedMessage defaultMessage="Update" />
            )}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
