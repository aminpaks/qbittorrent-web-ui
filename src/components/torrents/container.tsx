import { FC } from 'react';
import { TorrentList } from './list';
import { TorrentContextMenu } from './context-menu';
import { TorrentListSelection } from './selection';
import { DeleteConfirmation } from './delete-confirmation';
import { TorrentSetLocation } from './set-location';
import { TorrentRenameDialog } from './rename-dialog';

export const TorrentsContainer: FC = () => {
  return (
    <>
      <TorrentList />

      <TorrentContextMenu />

      <TorrentListSelection />

      <DeleteConfirmation />

      <TorrentSetLocation />

      <TorrentRenameDialog />
    </>
  );
};
