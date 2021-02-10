import { FormattedMessage } from 'react-intl';
import {
  CloseIcon,
  DeleteIcon,
  EditIcon,
  PauseIcon,
  PlayArrowIcon,
  TrackChangesIcon,
} from '../material-ui-icons';
import { CategoryAction } from './types';

export const getCategoryLabels = (action: CategoryAction, selectionCount?: number) => {
  switch (action) {
    case 'edit':
      return <FormattedMessage defaultMessage="Edit category" />;
    case 'delete':
      return <FormattedMessage defaultMessage="Delete category" />;
    case 'applyToItems':
      return selectionCount === 0 ? (
        <FormattedMessage defaultMessage="Apply to selection" />
      ) : (
        <FormattedMessage
          defaultMessage="Apply to selection <small>({count})</small>"
          values={{ small: (chunk: string) => <small>{chunk}</small>, count: selectionCount ?? 0 }}
        />
      );
    case 'resumeItems':
      return <FormattedMessage defaultMessage="Resume torrents" />;
    case 'pauseItems':
      return <FormattedMessage defaultMessage="Pause torrents" />;
    case 'deleteItems':
      return <FormattedMessage defaultMessage="Delete torrents" />;
    default:
      return null;
  }
};

export const getCategoryIcon = (action: CategoryAction) => {
  switch (action) {
    case 'edit':
      return <EditIcon fontSize="small" />;
    case 'delete':
      return <CloseIcon fontSize="small" />;
    case 'applyToItems':
      return <TrackChangesIcon fontSize="small" />;
    case 'resumeItems':
      return <PlayArrowIcon fontSize="small" />;
    case 'pauseItems':
      return <PauseIcon fontSize="small" />;
    case 'deleteItems':
      return <DeleteIcon fontSize="small" />;
    default:
      return null;
  }
};

export const getCategoryDisableStatus = (action: CategoryAction, selectionLength: number, counts: number) => {
  switch (action) {
    case 'edit':
    case 'delete':
      return false;
    case 'applyToItems':
      return selectionLength <= 0;
    case 'resumeItems':
    case 'pauseItems':
    case 'deleteItems':
      return counts <= 0;
    default:
      return true;
  }
};
