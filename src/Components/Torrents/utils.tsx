import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { Torrent, TorrentPrimitiveOperationOptions, TorrentState } from '../../api';
import { TorrentCollection } from '../../types';
import { getElementAttr } from '../../utils';
import { ArrowDownwardIcon, ArrowUpwardIcon, DoneIcon, PauseIcon } from '../materialUiIcons';
import { ContextAction } from './types';

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

export const getTorrentStateString = (state: TorrentState) =>
  torrentStateValues[state] || torrentStateValues.unknown;

export const getTorrentStateIcon = (state: TorrentState) => {
  switch (state) {
    case 'pausedUP':
      return <DoneIcon fontSize="small" color="inherit" />;
    case 'uploading':
    case 'forcedUP':
    case 'stalledUP':
      return <ArrowUpwardIcon fontSize="small" color={state === 'uploading' ? 'primary' : 'inherit'} />;
    case 'downloading':
    case 'forcedDL':
      return <ArrowDownwardIcon fontSize="small" htmlColor="#38806f" />;
    case 'pausedDL':
      return <PauseIcon fontSize="small" color="action" />;
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
  if (hash) {
    return collection[hash] ?? {};
  }
  return {};
};

export const getRowData = (e?: Element): { index: number | undefined; hash: string | undefined } => {
  const index = Number.parseInt(getElementAttr('data-row-index', '-1', e), 10);
  const hash = getElementAttr('data-torrent-hash', '' as string, e);

  return {
    index: Number.isNaN(index) ? undefined : index,
    hash: typeof hash !== 'string' || hash === '' ? undefined : hash,
  };
};

export const getContextMenuMainOperations = (state: TorrentState): [ContextAction, ContextAction] => {
  switch (state) {
    case 'forcedUP':
    case 'forcedDL':
      return ['resume', 'pause'];
    case 'pausedDL':
      return ['resume', 'setForceStart'];
    case 'stalledUP':
    case 'downloading':
      return ['pause', 'setForceStart'];
    default:
      return ['invalid', 'invalid'];
  }
};
