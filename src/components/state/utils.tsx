import { FormattedMessage } from 'react-intl';
import { ConnectionStatus, Torrent } from '../../api';
import { ContextOps, ContextOpsOrder } from '../types';

export const DEFAULT_CONTEXT_OPS: ContextOps[] = [
  'delete',
  'setLocation',
  'rename',
  'setAutoManagement',
  // 'setUploadLimit',
  'setShareLimits',
  'recheck',
  'reannounce',
  'copyName',
  'copyHash',
  'copyMagnetLink',
];

export const CONTEXT_OPS_ORDER: ContextOpsOrder = [
  'noop',
  'resume',
  'pause',
  'setForceStart',
  'delete',
  'setLocation',
  'rename',
  'setAutoManagement',
  'setDownloadLimit',
  'setUploadLimit',
  'setShareLimits',
  'setSuperSeeding',
  'toggleSequentialDownload',
  'toggleFirstLastPiecePrio',
  'topPrio',
  'increasePrio',
  'decreasePrio',
  'bottomPrio',
  'recheck',
  'reannounce',
  'copyName',
  'copyHash',
  'copyMagnetLink',
];

export const getConnectionStatusString = (status: ConnectionStatus) => {
  switch (status) {
    case 'connected':
      return <FormattedMessage defaultMessage="online" tagName="span" />;
    case 'firewalled':
      return <FormattedMessage defaultMessage="limited" tagName="span" />;
    case 'disconnected':
    default:
      return <FormattedMessage defaultMessage="offline" tagName="span" />;
  }
};

const getSortedContextMenuOperations = (v: ContextOps[]): ContextOps[] =>
  v
    .filter(item => item !== 'noop')
    .sort((x, y) => CONTEXT_OPS_ORDER.indexOf(x) - CONTEXT_OPS_ORDER.indexOf(y));

export const getContextOperations = (items = [] as Torrent[]): ContextOps[] => {
  const allStates = items.map(({ state }) => state);
  const hasCompletedItems = items.some(({ progress }) => progress === 1);

  let extraOperations: ContextOps[] = [];

  if (hasCompletedItems) {
    extraOperations.push('setSuperSeeding');
  }

  const [firstState = 'unknown'] = allStates;
  const [firstItem] = items;
  const isOneSelected = items.length === 1;
  if (items.length === 1 || allStates.every(state => state === firstState)) {
    switch (firstState) {
      case 'forcedUP':
      case 'forcedDL':
        return getSortedContextMenuOperations([
          ...DEFAULT_CONTEXT_OPS,
          'resume',
          'pause',
          ...extraOperations,
        ]);
      case 'pausedDL':
      case 'pausedUP':
        return getSortedContextMenuOperations([
          ...DEFAULT_CONTEXT_OPS,
          'resume',
          'setForceStart',
          ...extraOperations,
        ]);
      case 'stalledUP':
      case 'downloading':
        return getSortedContextMenuOperations([
          ...DEFAULT_CONTEXT_OPS,
          'pause',
          'setForceStart',
          ...extraOperations,
        ]);
      case 'checkingDL':
      case 'checkingResumeData':
      case 'checkingUP':
        return getSortedContextMenuOperations(['copyName', 'copyHash', 'copyMagnetLink']);
      default:
        return DEFAULT_CONTEXT_OPS.slice();
    }
  } else {
    console.log('mix');
    return getSortedContextMenuOperations(DEFAULT_CONTEXT_OPS.slice());
  }
};
