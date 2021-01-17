import { FormattedMessage } from 'react-intl';
import { ConnectionStatus, Torrent } from '../../api';
import { usePersistentMemo } from '../utils';
import { useTorrentsState } from './server-state';
import { useUiState } from './ui-state';

export const getConnectionStatusString = (status: ConnectionStatus) => {
  switch (status) {
    case 'connected':
      return <FormattedMessage defaultMessage="online" tagName="span" />;
    case 'firewalled':
      return <FormattedMessage defaultMessage="limited" tagName="span" />;
    case 'disconnected':
    default:
      return <FormattedMessage defaultMessage="offline" tagName="span" />;
  }
};

export const usePersistentSelectedTorrents = (): [Torrent[], (shouldPersist?: boolean) => void, string[]] => {
  const { collection, hashList } = useTorrentsState();
  const [{ torrentListSelection: selection }] = useUiState();

  const [torrents, persist] = usePersistentMemo(() => selection.map(hash => collection[hash] ?? { hash }), [
    selection,
    hashList,
  ]);

  return [torrents, persist, hashList];
};
