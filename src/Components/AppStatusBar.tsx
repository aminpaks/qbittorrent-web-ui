import { useServerState } from './State';
import { humanFileSize } from '../utils';

export const AppStatusBar = () => {
  const { connection_status, free_space_on_disk } = useServerState();

  return (
    <footer>
      <div>Server: {connection_status}</div>{' '}
      <div>
        Disk: {typeof free_space_on_disk === 'number' ? humanFileSize(free_space_on_disk) : 'Computing...'}
      </div>
    </footer>
  );
};
