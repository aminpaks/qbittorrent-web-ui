import { FC } from 'react';
import { TorrentList } from './list';
import { TorrentContextMenu } from './context-menu';
import { TorrentListSelection } from './selection';
import { DeleteConfirmation } from './delete-confirmation';

export const TorrentsContainer: FC = () => {
  return (
    <>
      <TorrentList />

      <TorrentContextMenu />

      <TorrentListSelection />

      <DeleteConfirmation />
    </>
  );
};
