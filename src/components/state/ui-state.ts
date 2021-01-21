import produce from 'immer';
import { actionCreator, ActionUnion, buildCustomContext } from '../utils';

export interface UiState {
  torrentListSelection: string[];
  contextMenu: {
    isOpen: boolean;
  };
  deleteConfirmation: {
    isOpen: boolean;
  };
  setLocation: {
    isOpen: boolean;
  };
  rename: {
    isOpen: boolean;
  };
  limitRateDialog: {
    kind: 'download' | 'upload';
    isOpen: boolean;
  };
  limitShareDialog: {
    isOpen: boolean;
  };
  addNewDialog: {
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
  setLocation: {
    isOpen: false,
  },
  rename: {
    isOpen: false,
  },
  limitRateDialog: {
    kind: 'download',
    isOpen: false,
  },
  limitShareDialog: {
    isOpen: false,
  },
  addNewDialog: {
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

const updateSetLocationDialogIsOpen = actionCreator('setLocation.isOpen')<{ value: boolean }>();

const updateRenameDialogIsOpen = actionCreator('rename.isOpen')<{ value: boolean }>();

const updateLimitRateDialogOpen = actionCreator('limitRateDialog.isOpen')<
  | {
      kind: 'download' | 'upload';
      value: true;
    }
  | { value: false }
>();

const updateShareLimitDialogOpen = actionCreator('limitShareDialog.isOpen')<{ value: boolean }>();

const updateAddNewDialogOpen = actionCreator('addNewDialog.isOpen')<{ value: boolean }>();

export const uiActions = {
  updateTorrentSelectionList,
  updateContextMenuIsOpen,
  updateDeleteConfirmationDialogIsOpen,
  updateSetLocationDialogIsOpen,
  updateRenameDialogIsOpen,
  updateLimitRateDialogOpen,
  updateShareLimitDialogOpen,
  updateAddNewDialogOpen,
};

export type UiActions = ActionUnion<typeof uiActions>;

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
      break;

    case 'setLocation.isOpen':
      draft.setLocation.isOpen = action.payload.value;
      break;

    case 'rename.isOpen':
      draft.rename.isOpen = action.payload.value;
      break;

    case 'limitRateDialog.isOpen':
      const { payload } = action;
      draft.limitRateDialog.isOpen = payload.value;
      if (payload.value === true) {
        draft.limitRateDialog.kind = payload.kind;
      }
      break;

    case 'limitShareDialog.isOpen':
      draft.limitShareDialog.isOpen = action.payload.value;
      break;

    case 'addNewDialog.isOpen':
      draft.addNewDialog.isOpen = action.payload.value;
      break;

    default:
      break;
  }
});

const UiContext = buildCustomContext(initialUiState, reducer, uiActions, 'UiStateProvider');

const { Provider: UiStateProvider, useCustomContext: useUiState } = UiContext;
export { UiStateProvider, useUiState };
