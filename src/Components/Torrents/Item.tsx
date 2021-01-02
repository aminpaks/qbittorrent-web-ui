import { FC } from 'react';
import { Torrent } from '../../api';
import { Box } from '../materialUiCore';

export const TorrentItem: FC<Torrent & { index: number }> = ({ hash, name }) => {
  return (
    <Box>
      {name} -- {hash}
    </Box>
  );
};
