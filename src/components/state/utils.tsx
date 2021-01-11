import { FormattedMessage } from 'react-intl';
import { ConnectionStatus, Torrent } from '../../api';
import { ContextOps, ContextOpsOrder } from '../types';

export const DEFAULT_CONTEXT_OPS: ContextOps[] = [
  'delete',
  'setLocation',
  'rename',
  'setAutoManagement',
  'setUploadLimit',
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
  v.sort((x, y) => CONTEXT_OPS_ORDER.indexOf(x) - CONTEXT_OPS_ORDER.indexOf(y));

export const getContextOperations = (
  { state = 'unknown', progress = 0 } = {} as Partial<Torrent>
): ContextOps[] => {
  switch (state) {
    case 'forcedUP':
    case 'forcedDL':
      return getSortedContextMenuOperations([
        ...DEFAULT_CONTEXT_OPS,
        'resume',
        'pause',
        progress === 1 ? 'setSuperSeeding' : 'setDownloadLimit',
      ]);
    case 'pausedDL':
    case 'pausedUP':
      return getSortedContextMenuOperations([
        ...DEFAULT_CONTEXT_OPS,
        'resume',
        'setForceStart',
        progress === 1 ? 'setSuperSeeding' : 'setDownloadLimit',
      ]);
    case 'stalledUP':
    case 'downloading':
      return getSortedContextMenuOperations([
        ...DEFAULT_CONTEXT_OPS,
        'pause',
        'setForceStart',
        progress === 1 ? 'setSuperSeeding' : 'setDownloadLimit',
      ]);
    case 'checkingDL':
    case 'checkingResumeData':
    case 'checkingUP':
      return getSortedContextMenuOperations(['copyName', 'copyHash', 'copyMagnetLink']);
    default:
      return getSortedContextMenuOperations([
        ...DEFAULT_CONTEXT_OPS,
        progress === 1 ? 'setSuperSeeding' : 'setDownloadLimit',
      ]);
  }
};
