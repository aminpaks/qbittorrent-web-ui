import { IconButton, Popover } from '@material-ui/core';
import { useRef, useState } from 'react';
import { Category } from '../../api';
import { mStyles } from '../common';
import { useCategoryOperationsMutation } from '../data';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from '../material-ui-core';
import { FolderIcon, FolderOpenIcon, MoreVertIcon } from '../material-ui-icons';
import { useCategories, useTorrentSortFilterState, useUiState } from '../state';
import { useClickOutsideElement, useDocumentEvents } from '../utils/events';
import { getCategoryDisableStatus, getCategoryIcon, getCategoryLabels } from './categories-utils';
import { CategoryAction } from './types';

const useStyles = mStyles(() => ({
  listRoot: {
    '& .MuiListItemSecondaryAction-root': {
      '&:hover': {
        '& .ModifyButton': {
          opacity: 1,
        },
      },
      '& .ModifyButton': {
        opacity: 0,
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
  const [{ torrentListSelection }] = useUiState();
  const [{ category: selectedCategoryName }, updateFilter] = useTorrentSortFilterState();

  useClickOutsideElement(() => {
    setState(INITIAL_STATE_VALUE);
  }, listRef.current);

  useDocumentEvents(
    ({ key }) => {
      if (key === 'Escape') {
        setState(INITIAL_STATE_VALUE);
      }
    },
    ['keyup']
  );

  const { mutate } = useCategoryOperationsMutation();

  const handleContextItemClick = (action: CategoryAction, params: { category: string; list: string[] }) => {
    switch (action) {
      case 'applyToItems': {
        mutate(params);
        break;
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
                {__internal ? null : (
                  <IconButton
                    edge="start"
                    size="small"
                    className="ModifyButton"
                    onClick={({ target }) => {
                      setState({ anchor: target as Element, category });
                      console.log('more actions', categoryId);
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
      <Popover keepMounted open={!!(state.anchor && state.category)} anchorEl={state.anchor}>
        <List ref={listRef} dense className={classes.listRoot}>
          {contextMenuActions.map((action, idx) =>
            action === 'divider' ? (
              <Divider key={String(idx)} />
            ) : (
              <ListItem
                key={action}
                button
                component="li"
                disabled={getCategoryDisableStatus(
                  action,
                  torrentListSelection.length,
                  state.category?.hashList.length ?? 0
                )}
                classes={{ root: classes.contextMenuItem }}
                onClick={() => {
                  handleContextItemClick(action, {
                    category: state.category!.name,
                    list: torrentListSelection,
                  });
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
    </>
  );
};
