import { FC, ReactElement, SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useTorrentsState } from '../State';
import { Menu, MenuItem } from '../materialUiCore';
import { canTorrentResume, getRowData } from './utils';
import { TorrentList } from './List';
import { CellTargetHandler } from './types';

export const TorrentsContainer: FC = () => {
  const torrents = useTorrentsState();
  const torrentsRef = useRef(torrents.collection);
  const [actionMenuState, setActionMenuState] = useState({
    hash: null as string | null,
    anchor: null as Element | null,
    isOpen: false,
    menus: [] as ReactElement[],
  });
  const handleActionMenuStateReset = useCallback(() => {
    setActionMenuState(s => ({
      hash: null,
      anchor: null,
      isOpen: false,
      menus: s.menus,
    }));
  }, []);
  const handleActionItemClick = useCallback((event: SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const { currentTarget } = event;

    const hash = currentTarget?.getAttribute('data-hash');
    const action = currentTarget?.getAttribute('data-action') as
      | 'resume'
      | 'pause'
      | 'delete'
      | 'setLocation'
      | 'rename'
      | null;
    const torrent = hash ? torrentsRef.current[hash] : null;
    if (action && hash && torrent) {
      console.log('action', action, 'on', torrent);
    }
    handleActionMenuStateReset();
  }, []);
  const handleActionMenuOpen: CellTargetHandler = useCallback(element => {
    const { hash = '' } = getRowData(element);
    if (hash && torrentsRef.current[hash]) {
      const { state } = torrentsRef.current[hash];
      const menus = [
        <MenuItem
          key="action-1"
          onClick={handleActionItemClick}
          data-action={canTorrentResume(state) ? 'resume' : 'pause'}
          data-hash={hash}
        >
          {canTorrentResume(state) ? 'Resume' : 'Pause'}
        </MenuItem>,
        <MenuItem key="action-2" onClick={handleActionItemClick} data-action="force-resume" data-hash={hash}>
          Force Resume
        </MenuItem>,
        <MenuItem key="action-3" onClick={handleActionItemClick} data-action="delete" data-hash={hash}>
          Delete
        </MenuItem>,
        <MenuItem key="action-4" onClick={handleActionItemClick} data-action="setLocation" data-hash={hash}>
          Set location
        </MenuItem>,
        <MenuItem key="action-5" onClick={handleActionItemClick} data-action="rename" data-hash={hash}>
          Rename
        </MenuItem>,
      ];
      setActionMenuState({ anchor: element, isOpen: true, hash, menus });
    }
  }, []);

  useEffect(() => {
    torrentsRef.current = torrents.collection;
  });

  return (
    <>
      <TorrentList onAction={handleActionItemClick} onMenuOpen={handleActionMenuOpen} />

      <Menu
        keepMounted
        open={actionMenuState.isOpen}
        anchorEl={actionMenuState.anchor}
        onClose={handleActionMenuStateReset}
      >
        {actionMenuState.menus}
      </Menu>
    </>
  );
};
