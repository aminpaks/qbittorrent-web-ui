import produce from 'immer';
import { Torrent } from '../../api';
import { ContextOps } from '../types';
import { actionCreator, buildCustomContext } from '../utils';
import { DEFAULT_CONTEXT_OPS, getContextOperations } from './utils';

export interface UiState {
  torrentListSelection: string[];
  contextMenu: {
    ops: ContextOps[];
    isOpen: boolean;
  };
}

const initialUiState: UiState = {
  torrentListSelection: [],
  contextMenu: {
    ops: [...DEFAULT_CONTEXT_OPS],
    isOpen: false,
  },
};

const updateTorrentSelectionList = actionCreator('torrentList.updateSelection')<{
  list: (
    | { item: Torrent; isSelected: boolean; type: 'absolute' }
    | { item: Torrent; type: 'relative' }
    | { item: Torrent; type: 'only' }
  )[];
}>();

const updateContextMenuIsOpen = actionCreator('contextMenu.isOpen')<{ value: boolean }>();

export type UiActions =
  | ReturnType<typeof updateTorrentSelectionList>
  | ReturnType<typeof updateContextMenuIsOpen>;

export const uiActions = {
  updateTorrentSelectionList,
  updateContextMenuIsOpen,
};

const reducer = produce((draft: UiState, action: UiActions) => {
  switch (action.type) {
    case 'torrentList.updateSelection': {
      const { list } = action.payload;
      list.forEach(current => {
        const { hash } = current.item;
        let isSelected = draft.torrentListSelection.indexOf(hash) < 0;
        switch (current.type) {
          case 'absolute': {
            isSelected = current.isSelected;
          }
          case 'relative': {
            if (isSelected === true) {
              draft.torrentListSelection.push(hash);
            } else {
              draft.torrentListSelection = draft.torrentListSelection.filter(itemHash => itemHash !== hash);
            }
            break;
          }
          case 'only': {
            draft.torrentListSelection = [hash];
            break;
          }
          default:
            break;
        }
      });
      break;
    }
    case 'contextMenu.isOpen':
      draft.contextMenu.isOpen = action.payload.value;
      break;
    default:
      break;
  }
});

const UiContext = buildCustomContext(initialUiState, reducer, uiActions, 'UiStateProvider');

const { Provider: UiStateProvider, useCustomContext: useUiState } = UiContext;
export { UiStateProvider, useUiState };
