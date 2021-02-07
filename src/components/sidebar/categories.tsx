import { mStyles } from '../common';
import { List, ListItem, ListItemIcon, ListItemText } from '../material-ui-core';
import { FolderIcon, FolderOpenIcon } from '../material-ui-icons';
import { useCategories, useTorrentSortFilterState } from '../state';

const useStyles = mStyles(() => ({
  listItemRoot: {
    '& > *': {
      pointerEvents: 'none',
    },
  },
}));

export const Categories = () => {
  const classes = useStyles();
  const categoryCollection = useCategories();
  const [{ category: selectedCategoryName }, updateFilter] = useTorrentSortFilterState();

  const categories = Object.values(categoryCollection);

  return (
    <List dense>
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
          </ListItem>
        );
      })}
    </List>
  );
};
