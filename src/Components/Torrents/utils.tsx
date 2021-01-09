import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { Torrent, TorrentState } from '../../api';
import { TorrentCollection } from '../../types';
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
  PauseIcon,
  PlayArrowIcon,
  SpeedIcon,
  SubtitlesIcon,
  VerticalAlignBottomIcon,
  VerticalAlignTopIcon,
} from '../materialUiIcons';
import { ContextAction, ContextActionOrder } from './types';

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

const contextMenuActionOrders: ContextActionOrder = [
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

export const getContextMenuActionString = (action: ContextAction) => {
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
      return <FormattedMessage defaultMessage="Sequel Order Download" />;
    case 'toggleFirstLastPiecePrio':
      return <FormattedMessage defaultMessage="Download First/Last Piece" />;
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

export const getContextMenuActionIcon = (
  action: ContextAction,
  { super_seeding = false, auto_tmm = 0 } = {} as Partial<Torrent>
) => {
  switch (action) {
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
      return <AssistantIcon fontSize="small" color={auto_tmm ? 'primary' : 'disabled'} />;
    case 'setSuperSeeding':
      return <SpeedIcon fontSize="small" color={super_seeding ? 'primary' : 'disabled'} />;
    case 'setDownloadLimit':
      return <VerticalAlignBottomIcon fontSize="small" />;
    case 'setUploadLimit':
      return <VerticalAlignTopIcon fontSize="small" />;
    case 'setShareLimits':
      return <BlockIcon fontSize="small" />;
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

const getSortedContextMenuOperations = (v: ContextAction[]): ContextAction[] =>
  v.sort((x, y) => contextMenuActionOrders.indexOf(x) - contextMenuActionOrders.indexOf(y));

const defaultActions: ContextAction[] = [
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

export const getContextMenuMainOperations = (
  { state = 'unknown', progress = 0 } = {} as Partial<Torrent>
): ContextAction[] => {
  switch (state) {
    case 'forcedUP':
    case 'forcedDL':
      return getSortedContextMenuOperations([
        ...defaultActions,
        'resume',
        'pause',
        progress === 1 ? 'setSuperSeeding' : 'setDownloadLimit',
      ]);
    case 'pausedDL':
    case 'pausedUP':
      return getSortedContextMenuOperations([
        ...defaultActions,
        'resume',
        'setForceStart',
        progress === 1 ? 'setSuperSeeding' : 'setDownloadLimit',
      ]);
    case 'stalledUP':
    case 'downloading':
      return getSortedContextMenuOperations([
        ...defaultActions,
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
        ...defaultActions,
        progress === 1 ? 'setSuperSeeding' : 'setDownloadLimit',
      ]);
  }
};

export const getContextMenuActionProps = (action: ContextAction, { state = 'unknown' }: Partial<Torrent>) => {
  switch (action) {
    case 'pause':
      return { divider: state === 'forcedDL' || state === 'forcedUP' };
    case 'setSuperSeeding':
      return { divider: true };
    case 'setForceStart':
    case 'delete':
    case 'setAutoManagement':
    case 'setShareLimits':
    case 'toggleFirstLastPiecePrio':
    case 'bottomPrio':
    case 'reannounce':
      return { divider: true };
    default:
      return { divider: false };
  }
};

export const copyTorrentPropToClipboard = (
  action: ContextAction,
  { hash = '', magnet_uri = '', name = '' }: Partial<Torrent>
) => {
  switch (action) {
    case 'copyName':
      return copyToClipboard(name);
    case 'copyHash':
      return copyToClipboard(hash);
    case 'copyMagnetLink':
      return copyToClipboard(magnet_uri);
    default:
      return Promise.resolve(undefined as void);
  }
};

export function getNotificationForContextAction(action: ContextAction, torrent: Torrent) {
  const truncatedName = torrent.name.substr(0, 16) + '...';
  switch (action) {
    case 'resume':
      return <FormattedMessage defaultMessage="Resumed {name}" values={{ name: truncatedName }} />;
    case 'pause':
      return <FormattedMessage defaultMessage="Pause {name}" values={{ name: truncatedName }} />;
    case 'recheck':
      return (
        <FormattedMessage
          defaultMessage="Started force recheck for {name}"
          values={{ name: truncatedName }}
        />
      );
    case 'reannounce':
      return (
        <FormattedMessage
          defaultMessage="Executed force reannounce for {name}"
          values={{ name: truncatedName }}
        />
      );
    case 'toggleSequentialDownload':
      return (
        <FormattedMessage
          defaultMessage="Toggled sequential download for {name}"
          values={{ name: truncatedName }}
        />
      );
    case 'toggleFirstLastPiecePrio':
      return (
        <FormattedMessage
          defaultMessage="Toggled first/last piece priority for {name}"
          values={{ name: truncatedName }}
        />
      );
    case 'copyName':
      return (
        <FormattedMessage defaultMessage="{value} copied to clipboard" values={{ value: truncatedName }} />
      );
    case 'copyHash':
      return <FormattedMessage defaultMessage="Hash copied to clipboard" />;
    case 'copyMagnetLink':
      return <FormattedMessage defaultMessage="Magnet URI copied to clipboard" />;
    default:
      return null;
  }
}
