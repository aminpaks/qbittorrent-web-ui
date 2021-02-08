import { IconButton } from '@material-ui/core';
import { mStyles } from '../common';
import { List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from '../material-ui-core';
import { FolderIcon, FolderOpenIcon, MoreVertIcon, PublishIcon, SettingsIcon } from '../material-ui-icons';
import { useCategories, useTorrentSortFilterState, useUiState } from '../state';

const useStyles = mStyles(({ spacing }) => ({
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
}));

export const Categories = () => {
  const classes = useStyles();
  const categoryCollection = useCategories();
  const [{ torrentListSelection }] = useUiState();
  const [{ category: selectedCategoryName }, updateFilter] = useTorrentSortFilterState();

  const categories = Object.values(categoryCollection);

  return (
    <List dense classes={{ root: classes.listRoot }}>
      {categories.map(({ __internal, name, hashList }) => {
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
                  onClick={() => {
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
  );
};
