import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { Torrent, TorrentCollection, TorrentState } from '../../api';
import { copyToClipboard, getElementAttr } from '../../utils';
import {
  ArrowDownwardIcon,
  ArrowUpwardIcon,
  AssistantIcon,
  BlockIcon,
  DeleteIcon,
  DoneIcon,
  FastForwardIcon,
  FileCopyIcon,
  FindInPageIcon,
  FolderOpenIcon,
  LinkIcon,
  LowPriorityIcon,
  PauseIcon,
  PlayArrowIcon,
  ReorderIcon,
  SpeedIcon,
  SubtitlesIcon,
  VerticalAlignBottomIcon,
  VerticalAlignTopIcon,
} from '../material-ui-icons';
import { ContextOps, ContextOpsSetting, ContextOpsOrder } from '../types';

const torrentStateValues: Record<TorrentState, ReactNode> = {
  allocating: <FormattedMessage defaultMessage="Allocating" />,
  checkingDL: <FormattedMessage defaultMessage="Checking" />,
  checkingResumeData: <FormattedMessage defaultMessage="Checking resume data" />,
  checkingUP: <FormattedMessage defaultMessage="Checking" />,
  downloading: <FormattedMessage defaultMessage="Downloading" />,
  error: <FormattedMessage defaultMessage="Error" />,
  forcedDL: (
    <FormattedMessage
      defaultMessage="Downloading <small>[F]</small>"
      values={{
        small: (char: string) => <small>{char}</small>,
      }}
    />
  ),
  forcedUP: (
    <FormattedMessage
      defaultMessage="Seeding <small>[F]</small>"
      values={{ small: (char: string) => <small>{char}</small> }}
    />
  ),
  metaDL: <FormattedMessage defaultMessage="Meta Download" />,
  missingFiles: <FormattedMessage defaultMessage="Missing files" />,
  moving: <FormattedMessage defaultMessage="Moving" />,
  pausedDL: <FormattedMessage defaultMessage="Paused" />,
  pausedUP: <FormattedMessage defaultMessage="Completed" />,
  queuedDL: <FormattedMessage defaultMessage="Queued" />,
  queuedUP: <FormattedMessage defaultMessage="Queued upload" />,
  stalledDL: <FormattedMessage defaultMessage="Stalled" />,
  stalledUP: <FormattedMessage defaultMessage="Seeding" />,
  uploading: <FormattedMessage defaultMessage="Seeding" />,
  unknown: <FormattedMessage defaultMessage="Unknown" />,
};

export const getContextMenuActionString = (action: ContextOps) => {
  switch (action) {
    case 'resume':
      return <FormattedMessage defaultMessage="Resume" />;
    case 'pause':
      return <FormattedMessage defaultMessage="Pause" />;
    case 'setForceStart':
      return <FormattedMessage defaultMessage="Force Resume" />;
    case 'delete':
      return <FormattedMessage defaultMessage="Delete" />;
    case 'setLocation':
      return <FormattedMessage defaultMessage="Set Location" />;
    case 'rename':
      return <FormattedMessage defaultMessage="Rename" />;
    case 'setAutoManagement':
      return <FormattedMessage defaultMessage="Automatic Management" />;
    case 'setSuperSeeding':
      return <FormattedMessage defaultMessage="Super Seed" />;
    case 'setDownloadLimit':
      return <FormattedMessage defaultMessage="Limit Download Rate" />;
    case 'setUploadLimit':
      return <FormattedMessage defaultMessage="Limit Upload Rate" />;
    case 'setShareLimits':
      return <FormattedMessage defaultMessage="Limit Share Ratio" />;
    case 'toggleSequentialDownload':
      return <FormattedMessage defaultMessage="Download in Sequential Order" />;
    case 'toggleFirstLastPiecePrio':
      return <FormattedMessage defaultMessage="Download First/Last Piece First" />;
    case 'topPrio':
      return <FormattedMessage defaultMessage="Move to Top of Queue" />;
    case 'increasePrio':
      return <FormattedMessage defaultMessage="Move Up One in Queue" />;
    case 'decreasePrio':
      return <FormattedMessage defaultMessage="Move Down One in Queue" />;
    case 'bottomPrio':
      return <FormattedMessage defaultMessage="Move to Bottom of Queue" />;
    case 'recheck':
      return <FormattedMessage defaultMessage="Recheck [F]" />;
    case 'reannounce':
      return <FormattedMessage defaultMessage="Reannounce [F]" />;
    case 'copyName':
      return <FormattedMessage defaultMessage="Copy Name" />;
    case 'copyHash':
      return <FormattedMessage defaultMessage="Copy Hash" />;
    case 'copyMagnetLink':
      return <FormattedMessage defaultMessage="Copy Magnet Link" />;
    case 'noop':
    default:
      return null;
  }
};

export const getContextMenuOperationIcon = (operationDetail: ContextOpsSetting) => {
  const [operation, isEnabled = false] = operationDetail;
  switch (operation) {
    case 'resume':
      return <PlayArrowIcon fontSize="small" />;
    case 'pause':
      return <PauseIcon fontSize="small" />;
    case 'setForceStart':
      return <FastForwardIcon fontSize="small" />;
    case 'delete':
      return <DeleteIcon fontSize="small" />;
    case 'setLocation':
      return <FolderOpenIcon fontSize="small" />;
    case 'rename':
      return <SubtitlesIcon fontSize="small" />;
    case 'setAutoManagement':
      return <AssistantIcon fontSize="small" color={isEnabled === true ? 'primary' : 'disabled'} />;
    case 'setSuperSeeding':
      return <SpeedIcon fontSize="small" color={isEnabled === true ? 'primary' : 'disabled'} />;
    case 'setDownloadLimit':
      return <VerticalAlignBottomIcon fontSize="small" />;
    case 'setUploadLimit':
      return <VerticalAlignTopIcon fontSize="small" />;
    case 'setShareLimits':
      return <BlockIcon fontSize="small" />;
    case 'toggleSequentialDownload':
      return <ReorderIcon fontSize="small" color={isEnabled === true ? 'primary' : 'disabled'} />;
    case 'toggleFirstLastPiecePrio':
      return <LowPriorityIcon fontSize="small" color={isEnabled === true ? 'primary' : 'disabled'} />;
    case 'recheck':
    case 'reannounce':
      return <FindInPageIcon fontSize="small" />;
    case 'copyName':
    case 'copyHash':
      return <FileCopyIcon fontSize="small" />;
    case 'copyMagnetLink':
      return <LinkIcon fontSize="small" />;
    default:
      return null;
  }
};

export const getTorrentStateString = (state: TorrentState) =>
  torrentStateValues[state] || torrentStateValues.unknown;

export const getTorrentStateIcon = (state: TorrentState) => {
  switch (state) {
    case 'pausedDL':
      return <PauseIcon fontSize="small" color="action" />;
    case 'pausedUP':
      return <DoneIcon fontSize="small" color="action" />;
    case 'uploading':
    case 'forcedUP':
    case 'stalledUP':
      return <ArrowUpwardIcon fontSize="small" color={state === 'uploading' ? 'primary' : 'inherit'} />;
    case 'downloading':
    case 'forcedDL':
      return <ArrowDownwardIcon fontSize="small" htmlColor="#38806f" />;
    case 'checkingDL':
    case 'checkingResumeData':
    case 'checkingUP':
      return <FindInPageIcon fontSize="small" color="action" />;
    default:
      return null;
  }
};

export const getTorrentHash = (index: number, hashList: string[]): string | undefined => hashList[index];

export const getTorrentOrElse = (
  index: number,
  hashList: string[],
  collection: TorrentCollection
): Partial<Torrent> => {
  const hash = getTorrentHash(index, hashList);
  const torrent = collection[hash || ''];

  return torrent ? torrent : {};
};

export const getRowData = (e?: Element): { index: number | undefined; hash: string | undefined } => {
  const index = Number.parseInt(getElementAttr('data-row-index', '-1', e), 10);
  const hash = getElementAttr('data-torrent-hash', '' as string, e);

  return {
    index: Number.isNaN(index) ? undefined : index,
    hash: typeof hash !== 'string' || hash === '' ? undefined : hash,
  };
};

export const copyTorrentPropToClipboard = (action: ContextOps, items: Torrent[]) => {
  switch (action) {
    case 'copyName':
      return copyToClipboard(items.map(({ name }) => name).join('\n'));
    case 'copyHash':
      return copyToClipboard(items.map(({ hash }) => hash).join('\n'));
    case 'copyMagnetLink':
      return copyToClipboard(items.map(({ magnet_uri }) => magnet_uri).join('\n'));
    default:
      return Promise.resolve(undefined as void);
  }
};

export function getNotificationForContextOps(action: ContextOps, items: Torrent[]) {
  const values = { itemCount: items.length };
  switch (action) {
    case 'resume':
      return (
        <FormattedMessage
          defaultMessage="Resumed {itemCount, plural,
        one {# item}
        other {# items}
      }"
          values={values}
        />
      );
    case 'pause':
      return (
        <FormattedMessage
          defaultMessage="Paused {itemCount, plural,
        one {# item}
        other {# items}
      }"
          values={values}
        />
      );
    case 'setLocation':
      return (
        <FormattedMessage
          defaultMessage="Location updated on {itemCount, plural,
              one {# item}
              other {# items}
            }"
          values={values}
        />
      );
    case 'rename':
      return <FormattedMessage defaultMessage="Name updated on one item" />;
    case 'recheck':
      return (
        <FormattedMessage
          defaultMessage="Started force recheck on {itemCount, plural,
            one {# item}
            other {# items}
          }"
          values={values}
        />
      );
    case 'setDownloadLimit':
    case 'setUploadLimit':
      return (
        <FormattedMessage
          defaultMessage="New {type} rate applied to {itemCount, plural,
            one {# item}
            other {# items}
          }"
          values={{
            ...values,
            type:
              action === 'setDownloadLimit' ? (
                <FormattedMessage defaultMessage="download" />
              ) : (
                <FormattedMessage defaultMessage="upload" />
              ),
          }}
        />
      );
    case 'setShareLimits':
      return (
        <FormattedMessage
          defaultMessage="New share limit applied to {itemCount, plural,
            one {one item}
            other {# items}
          }"
          values={values}
        />
      );
    case 'reannounce':
      return (
        <FormattedMessage
          defaultMessage="Executed force reannounce on {itemCount, plural,
            one {# item}
            other {# items}
          }"
          values={values}
        />
      );
    case 'toggleSequentialDownload':
      return (
        <FormattedMessage
          defaultMessage="Toggled sequential download {itemCount, plural,
            one {# item}
            other {# items}
          }"
          values={values}
        />
      );
    case 'toggleFirstLastPiecePrio':
      return (
        <FormattedMessage
          defaultMessage="Toggled first/last piece priority on {itemCount, plural,
            one {# item}
            other {# items}
          }"
          values={values}
        />
      );
    case 'copyName':
      return (
        <FormattedMessage
          defaultMessage="Copied {itemCount, plural,
          one {# name}
          other {# names}
        } to clipboard"
          values={values}
        />
      );
    case 'copyHash':
      return (
        <FormattedMessage
          defaultMessage="Copied {itemCount, plural,
        one {# hash}
        other {# hashes}
      } to clipboard"
          values={values}
        />
      );
    case 'copyMagnetLink':
      return (
        <FormattedMessage
          defaultMessage="Copied {itemCount, plural,
        one {# magnet URI}
        other {# magnet URIs}
      } to clipboard"
          values={values}
        />
      );
    default:
      return null;
  }
}

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

export const DEFAULT_CONTEXT_OPS: ContextOps[] = [
  'delete',
  'setLocation',
  'setUploadLimit',
  'setShareLimits',
  'recheck',
  'reannounce',
  'copyName',
  'copyHash',
  'copyMagnetLink',
];

export const getOperationDivider = (
  operation: ContextOps = 'noop',
  previousOperation: ContextOps = 'noop',
  nextOperation: ContextOps = 'noop'
): boolean => {
  switch (operation) {
    case 'setUploadLimit':
      return previousOperation !== 'setDownloadLimit';
    case 'setDownloadLimit':
    case 'setLocation':
    case 'delete':
    case 'toggleSequentialDownload':
    case 'recheck':
    case 'copyName':
      return true;
    default:
      return false;
  }
};

const getSortedContextMenuOperations = (v: ContextOpsSetting[]): ContextOpsSetting[] =>
  v
    .filter(item => item[0] !== 'noop')
    .sort(([x], [y]) => CONTEXT_OPS_ORDER.indexOf(x) - CONTEXT_OPS_ORDER.indexOf(y));

const isCheckingState = (state: TorrentState) =>
  state === 'checkingDL' || state === 'checkingUP' || state === 'checkingResumeData';
const isForcedState = (state: TorrentState) => state === 'forcedDL' || state === 'forcedUP';
const isDownloadingState = (state: TorrentState) =>
  state === 'downloading' || state === 'forcedDL' || state === 'stalledDL';
const isUploadingState = (state: TorrentState) =>
  state === 'uploading' || state === 'forcedUP' || state === 'stalledUP';
const isPausedState = (state: TorrentState) =>
  state === 'pausedUP' || state === 'pausedDL' || state === 'forcedUP' || state === 'forcedDL';

export const getContextOperations = (items = [] as Torrent[]): ContextOpsSetting[] => {
  if (items.length < 1) {
    return [];
  }

  const [{ state: firstState = 'unknown' } = {}] = items;
  const areAllStateSame = !items.some(({ state }) => state !== firstState);
  const isForced = areAllStateSame
    ? isForcedState(firstState)
    : items.some(({ state }) => isForcedState(state));
  const isPaused = areAllStateSame
    ? isPausedState(firstState)
    : items.some(({ state }) => isPausedState(state));
  const isDownloading = areAllStateSame
    ? isDownloadingState(firstState)
    : items.some(({ state }) => isDownloadingState(state));
  const isUploading = areAllStateSame
    ? isUploadingState(firstState)
    : items.some(({ state }) => isUploadingState(state));
  const hasSomeIncomplete =
    items.length === 1 ? items[0].progress < 1 : items.some(({ progress }) => progress < 1);

  if (items.length === 1 && isCheckingState(firstState)) {
    return [
      ['copyName', false],
      ['copyHash', false],
      ['copyMagnetLink', false],
    ];
  }

  const ops: Map<ContextOps, boolean> = new Map(DEFAULT_CONTEXT_OPS.map(op => [op, false]));

  ops.set('setAutoManagement', !items.some(({ auto_tmm }) => auto_tmm === false));
  if (items.some(({ progress }) => progress === 1)) {
    ops.set('setSuperSeeding', !items.some(({ super_seeding }) => super_seeding === false));
  }
  if (isDownloading || (isPaused && hasSomeIncomplete)) {
    ops.set('setDownloadLimit', false);
  }
  if (isDownloading || isUploading) {
    ops.set('pause', false);
  }
  if (isPaused) {
    ops.set('resume', false);
  }
  if (isForced) {
    ops.set('resume', false);
  } else {
    ops.set('setForceStart', false);
  }
  if ((isPaused || isDownloading) && hasSomeIncomplete) {
    ops.set('toggleSequentialDownload', !items.some(({ seq_dl }) => seq_dl === false));
    ops.set('toggleFirstLastPiecePrio', !items.some(({ f_l_piece_prio }) => f_l_piece_prio === false));
  }
  if (items.length === 1) {
    ops.set('rename', false);
  }

  return getSortedContextMenuOperations(Array.from(ops.entries()));
};
