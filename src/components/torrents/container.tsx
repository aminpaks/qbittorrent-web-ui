import { FC } from 'react';
import { TorrentList } from './list';
import { TorrentContextMenu } from './context-menu';
import { TorrentListSelection } from './selection';
import { DeleteConfirmation } from './delete-confirmation';
import { TorrentSetLocation } from './set-location';
import { TorrentRenameDialog } from './rename-dialog';
import { TorrentLimitRateDialog } from './limit-rate-dialog';
import { TorrentShareLimitDialog } from './limit-share-dialog';
import { TorrentAddNewDialog } from './add-new-dialog';
import { TorrentDetails } from './details';

export const TorrentsContainer: FC = () => {
  return (
    <>
      <TorrentDetails list={<TorrentList />} />

      <TorrentContextMenu />

      <TorrentListSelection />

      <DeleteConfirmation />

      <TorrentSetLocation />

      <TorrentRenameDialog />

      <TorrentLimitRateDialog />

      <TorrentShareLimitDialog />

      <TorrentAddNewDialog />
    </>
  );
};
