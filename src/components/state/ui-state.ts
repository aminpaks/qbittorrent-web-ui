import produce from 'immer';
import { actionCreator, buildCustomContext } from '../utils';

export interface UiState {
  torrentListSelection: string[];
  contextMenu: {
    isOpen: boolean;
  };
  deleteConfirmation: {
    isOpen: boolean;
  };
}

const initialUiState: UiState = {
  torrentListSelection: [],
  contextMenu: {
    isOpen: false,
  },
  deleteConfirmation: {
    isOpen: false,
  },
};

const updateTorrentSelectionList = actionCreator('torrentList.updateSelection')<
  | {
      type: 'absolute';
      list: { hash: string; isSelected: boolean }[];
    }
  | { type: 'only' | 'relative'; list: string[] }
>();

const updateContextMenuIsOpen = actionCreator('contextMenu.isOpen')<{ value: boolean }>();

const updateDeleteConfirmationDialogIsOpen = actionCreator('deleteConfirmation.isOpen')<{ value: boolean }>();

export type UiActions =
  | ReturnType<typeof updateTorrentSelectionList>
  | ReturnType<typeof updateContextMenuIsOpen>
  | ReturnType<typeof updateDeleteConfirmationDialogIsOpen>;

export const uiActions = {
  updateTorrentSelectionList,
  updateContextMenuIsOpen,
  updateDeleteConfirmationDialogIsOpen,
};

const reducer = produce((draft: UiState, action: UiActions) => {
  switch (action.type) {
    case 'torrentList.updateSelection': {
      const { payload } = action;
      if (payload.type === 'absolute') {
        const { list } = payload;
        list.forEach(current => {
          let { isSelected, hash } = current;
          if (isSelected === true) {
            if (draft.torrentListSelection.indexOf(hash) < 0) {
              draft.torrentListSelection.push(hash);
            }
          } else {
            draft.torrentListSelection = draft.torrentListSelection.filter(itemHash => itemHash !== hash);
          }
        });
      } else if (payload.type === 'relative') {
        const { list } = payload;
        list.forEach(hash => {
          const hashIndex = draft.torrentListSelection.indexOf(hash);
          if (hashIndex < 0) {
            draft.torrentListSelection.push(hash);
          } else {
            draft.torrentListSelection = draft.torrentListSelection.filter(
              currentHash => currentHash !== hash
            );
          }
        });
      } else {
        draft.torrentListSelection = payload.list;
      }
      break;
    }
    case 'contextMenu.isOpen':
      draft.contextMenu.isOpen = action.payload.value;
      break;

    case 'deleteConfirmation.isOpen':
      draft.deleteConfirmation.isOpen = action.payload.value;
    default:
      break;
  }
});

const UiContext = buildCustomContext(initialUiState, reducer, uiActions, 'UiStateProvider');

const { Provider: UiStateProvider, useCustomContext: useUiState } = UiContext;
export { UiStateProvider, useUiState };
