import produce from 'immer';
import { actionCreator, buildCustomContext } from '../utils';

export interface UiState {
  torrentListSelection: string[];
}

const initialUiState = {
  torrentListSelection: [],
} as UiState;

const updateSelectionTorrentList = actionCreator('torrentList.updateSelection')<{
  hashList: string[];
}>();

export type UiActions = ReturnType<typeof updateSelectionTorrentList>;

export const uiActions = {
  updateSelectionTorrentList,
};

const reducer = produce((draft: UiState, action: UiActions) => {
  switch (action.type) {
    case 'torrentList.updateSelection':
      draft.torrentListSelection = action.payload.hashList;
      break;
    default:
      break;
  }
});

const UiContext = buildCustomContext(initialUiState, reducer, uiActions);

const { Provider: UiStateProvider, useCustomContext: useUiState } = UiContext;
export { UiStateProvider, useUiState };
