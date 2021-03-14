import { IconButton, Popover } from '@material-ui/core';
import { useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Category } from '../../api';
import { mStyles } from '../common';
import { useCategoryOperationsMutation, useTorrentsOperationMutation } from '../data';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from '../material-ui-core';
import { AddCircleIcon, FolderIcon, FolderOpenIcon, MoreVertIcon } from '../material-ui-icons';
import { useNotifications } from '../notifications';
import { useCategories, useTorrentSortFilterState, useUiState } from '../state';
import { useClickOutsideElement, useDocumentEvents } from '../utils/events';
import { getCategoryDisableStatus, getCategoryIcon, getCategoryLabels } from './categories-utils';
import { CategoryAddEditDialog } from './category-add-edit-dialog';
import { CategoryDeleteDialog } from './category-delete-dialog';
import { CategoryAction } from './types';

const useStyles = mStyles(() => ({
  popoverRoot: {
    bottom: 'auto !important',
    height: 'var(--height) !important',
  },
  listRoot: {
    '& .MuiListItemSecondaryAction-root': {
      '&:hover': {
        '& .ModifyButton': {
          opacity: 1,
        },
      },
      '& .ModifyButton': {
        ['@media (min-height: 400px)']: {
          opacity: 0,
        },
        transition: '140ms ease opacity',
      },
    },
  },
  listItemRoot: {
    '& > *': {
      pointerEvents: 'none',
    },
    '&:hover, &.Mui-selected': {
      '& + div .ModifyButton': {
        opacity: 1,
      },
    },
  },
  contextMenuItem: {
    '& .MuiListItemIcon-root': {
      minWidth: 30,
    },
  },
}));

const contextMenuActions: (CategoryAction | 'divider')[] = [
  'edit',
  'delete',
  'divider',
  'applyToItems',
  'divider',
  'resumeItems',
  'pauseItems',
  'deleteItems',
];

const INITIAL_STATE_VALUE = { anchor: null as Element | null, category: null as Category | null };

export const Categories = () => {
  const classes = useStyles();
  const listRef = useRef<HTMLUListElement>(null);
  const [state, setState] = useState(INITIAL_STATE_VALUE);
  const categoryCollection = useCategories();
  const [
    { torrentListSelection },
    { updateCategoryAddEditDialogOpen, updateCategoryDeleteDialogOpen, updateDeleteConfirmationDialogIsOpen },
  ] = useUiState();
  const [{ category: selectedCategoryName }, updateFilter] = useTorrentSortFilterState();
  const { create: createNotification } = useNotifications();

  useClickOutsideElement(() => {
    setState(s => ({ ...s, anchor: null }));
  }, listRef.current);

  useDocumentEvents(
    ({ key }) => {
      if (key === 'Escape') {
        setState(s => ({ ...s, anchor: null }));
      }
    },
    ['keyup']
  );

  const { mutate: update } = useCategoryOperationsMutation({
    onSuccess: () => {},
  });
  const { mutate: torrentsOperates } = useTorrentsOperationMutation();

  const handleContextItemClick = (
    action: CategoryAction,
    { category, list }: { category: string; list: string[] }
  ) => {
    switch (action) {
      case 'create': {
        updateCategoryAddEditDialogOpen({
          value: true,
          type: 'add',
        });
        break;
      }
      case 'edit': {
        updateCategoryAddEditDialogOpen({
          value: true,
          type: 'edit',
          category: categoryCollection[category],
        });
        break;
      }
      case 'delete': {
        updateCategoryDeleteDialogOpen({ value: true, categories: [category] });
        break;
      }
      case 'applyToItems': {
        update(['assign', { category, list }]);
        break;
      }
      case 'resumeItems': {
        torrentsOperates({ list, params: ['resume'] });
        break;
      }
      case 'pauseItems': {
        torrentsOperates({ list, params: ['pause'] });
        break;
      }
      case 'deleteItems': {
        updateDeleteConfirmationDialogIsOpen({ value: true, list });
      }
      default:
        break;
    }
  };

  const categories = Object.values(categoryCollection);

  return (
    <>
      <List dense classes={{ root: classes.listRoot }}>
        {categories.map(category => {
          const { __internal, name, hashList } = category;
          const categoryId = __internal ? __internal : name;
          const categoryName = name;

          return (
            <ListItem
              key={categoryId}
              button
              component="li"
              selected={selectedCategoryName === categoryId}
              classes={{ root: classes.listItemRoot }}
              title={categoryName}
              onClick={() => {
                updateFilter({ category: categoryId });
              }}
            >
              <ListItemIcon>
                {selectedCategoryName === categoryId ? <FolderOpenIcon /> : <FolderIcon />}
              </ListItemIcon>
              <ListItemText>
                <span className="shouldShorten">{categoryName}</span> <small>({hashList.length})</small>
              </ListItemText>
              <ListItemSecondaryAction>
                {__internal === '__all__' ? (
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => {
                      updateCategoryAddEditDialogOpen({ value: true, type: 'add' });
                    }}
                  >
                    <AddCircleIcon fontSize="small" />
                  </IconButton>
                ) : (
                  <IconButton
                    edge="end"
                    size="small"
                    className="ModifyButton"
                    onClick={({ target }) => {
                      setState({ anchor: target as Element, category });
                    }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
      <Popover
        keepMounted
        open={!!(state.anchor && state.category)}
        anchorEl={state.anchor}
        classes={{ root: classes.popoverRoot }}
      >
        <List ref={listRef} dense className={classes.listRoot}>
          {contextMenuActions.map((action, idx) =>
            action === 'divider' ? (
              <Divider key={String(idx)} />
            ) : (
              <ListItem
                key={action}
                button
                component="li"
                disabled={getCategoryDisableStatus({
                  action,
                  category: state.category || undefined,
                  selectionLength: torrentListSelection.length,
                  counts: state.category?.hashList.length ?? 0,
                })}
                classes={{ root: classes.contextMenuItem }}
                onClick={() => {
                  if (!state.category) {
                    return createNotification({
                      message: <FormattedMessage defaultMessage="Cannot find selected category!" />,
                      severity: 'error',
                    });
                  }
                  const { __internal, hashList: categoryItems, name } = state.category;
                  const category = __internal ? '' : name;
                  const list = action === 'applyToItems' ? torrentListSelection : categoryItems;
                  handleContextItemClick(action, { category, list });
                  setState(INITIAL_STATE_VALUE);
                }}
              >
                <ListItemIcon className="listitem-icon">{getCategoryIcon(action)}</ListItemIcon>
                <ListItemText>{getCategoryLabels(action, torrentListSelection.length)}</ListItemText>
              </ListItem>
            )
          )}
        </List>
      </Popover>
      <CategoryDeleteDialog />
      <CategoryAddEditDialog />
    </>
  );
};
