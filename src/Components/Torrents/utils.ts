import { createElement } from 'react';
import { TorrentState } from '../../api';
import { Pause } from '../materialUiIcons';

const torrentStateValues: Record<TorrentState, string> = {
  allocating: 'Allocating',
  checkingDL: 'Checking',
  checkingResumeData: 'Checking resume data',
  checkingUP: 'Checking',
  downloading: 'Downloading',
  error: 'Error',
  forceDL: 'Force Download',
  forcedUP: 'Forced',
  metaDL: 'Meta Download',
  missingFiles: 'Missing files',
  moving: 'Moving',
  pausedDL: 'Paused',
  pausedUP: 'Paused upload',
  queuedDL: 'Queued',
  queuedUP: 'Queued upload',
  stalledDL: 'Stalled',
  stalledUP: 'Stalled upload',
  uploading: 'Uploading',
  unknown: 'Unknown',
};

export const getTorrentStateString = (state: TorrentState) =>
  torrentStateValues[state] || torrentStateValues.unknown;

const iconProps = { fontSize: 'small' };
export const getTorrentStateIcon = (state: TorrentState) => {
  switch (state) {
    case 'pausedDL':
      return createElement<object>(Pause, iconProps, null);
    default:
      return null;
  }
};
