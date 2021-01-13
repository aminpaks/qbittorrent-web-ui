import { FC } from 'react';
import { TorrentList } from './list';
import { TorrentContextMenu } from './context-menu';
import { TorrentListSelection } from './selection';

export const TorrentsContainer: FC = () => {
  return (
    <>
      <TorrentList />

      <TorrentContextMenu />

      <TorrentListSelection />
    </>
  );
};
