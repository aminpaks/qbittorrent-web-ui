import { createElement } from 'react';
import { Torrent, TorrentState } from '../../api';
import { TorrentCollection } from '../../types';
import { SvgIconTypeMap } from '../materialUiCore';
import { ArrowDownwardIcon, ArrowUpwardIcon, DoneIcon, PauseIcon } from '../materialUiIcons';
import { tableColumns } from './columns';

const torrentStateValues: Record<TorrentState, string> = {
  allocating: 'Allocating',
  checkingDL: 'Checking',
  checkingResumeData: 'Checking resume data',
  checkingUP: 'Checking',
  downloading: 'Downloading',
  error: 'Error',
  forceDL: '[F] Downloading',
  forcedUP: '[F] Seeding',
  metaDL: 'Meta Download',
  missingFiles: 'Missing files',
  moving: 'Moving',
  pausedDL: 'Paused',
  pausedUP: 'Completed',
  queuedDL: 'Queued',
  queuedUP: 'Queued upload',
  stalledDL: 'Stalled',
  stalledUP: 'Seeding',
  uploading: 'Seeding',
  unknown: 'Unknown',
};

export const getTorrentStateString = (state: TorrentState) =>
  torrentStateValues[state] || torrentStateValues.unknown;

const getIconProps = (
  { color = 'inherit', htmlColor } = {} as {
    color?: 'inherit' | 'primary' | 'secondary' | 'action' | 'disabled' | 'error';
    htmlColor?: string;
  }
) => (({ color, htmlColor, fontSize: 'small' } as unknown) as SvgIconTypeMap<object>);
export const getTorrentStateIcon = (state: TorrentState) => {
  switch (state) {
    case 'pausedUP':
      return createElement<object>(DoneIcon, getIconProps(), null);
    case 'uploading':
    case 'forcedUP':
    case 'stalledUP':
      return createElement<object>(
        ArrowUpwardIcon,
        getIconProps({ color: state === 'uploading' ? 'primary' : undefined }),
        null
      );
    case 'downloading':
    case 'forceDL':
      return createElement<object>(ArrowDownwardIcon, getIconProps({ htmlColor: '#38806f' }), null);
    case 'pausedDL':
      return createElement<object>(PauseIcon, getIconProps({ color: 'action' }), null);
    default:
      return null;
  }
};

export const canTorrentResume = (state: TorrentState) => {
  switch (state) {
    case 'pausedDL':
    case 'pausedUP':
      return true;
    default:
      return false;
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

export const getColumnWidth: (p: { index: number }) => number = ({ index }) => {
  switch (index) {
    default:
      return tableColumns[index]?.width ?? 40;
  }
};
