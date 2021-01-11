import produce from 'immer';
import { useEffect, useRef, useState } from 'react';
import { useTorrentsState, useUiState } from '../state';
import { ROW_CELL_HEIGHT } from './list';
import { color, getElementAttr } from '../../utils';
import { mStyles } from '../common';
import { Torrent } from '../../api';

const useStyles = mStyles(() => {
  return {
    rootContainer: {
      position: 'fixed',
      border: `1px dotted ${color('#000').alpha(0.3).rgb().string()}`,
      backgroundColor: color('#000').alpha(0.1).rgb().string(),
      zIndex: 20,
    },
  };
});

const initialState = {
  keys: {
    ctrl: false,
    command: false,
  },
  start: {
    hash: '',
    x: -1,
    y: -1,
    yDiff: -1,
  },
  end: {
    x: -1,
    y: -1,
  },
};

export const TorrentListSelection = () => {
  const classes = useStyles();
  const { collection, hashList } = useTorrentsState();
  const [, { updateTorrentSelectionList, updateContextMenuIsOpen }] = useUiState();
  const [state, setState] = useState(initialState);
  const isUpdatingEndRef = useRef(false);
  const currentRangeRef = useRef([0, 0] as [number, number]);
  const torrentsRef = useRef(collection);

  useEffect(() => {
    function handleEvent(event: MouseEvent) {
      const {
        isTrusted,
        type,
        clientX: x,
        clientY: y,
        target,
        button,
        buttons,
        ctrlKey,
        shiftKey,
        metaKey,
      } = event;
      if (isTrusted) {
        if (target) {
          if (type === 'mousedown' && (button !== 2 || ctrlKey || metaKey)) {
            const hash = getElementAttr('data-torrent-hash', '', target as Element);
            if (hash) {
              if (!isUpdatingEndRef.current) {
                const { y: yPos } = (target as Element).getBoundingClientRect();
                isUpdatingEndRef.current = true;

                setState(s =>
                  produce(s, draft => {
                    draft.keys = { ctrl: ctrlKey, command: metaKey };
                    draft.start = { x, y, hash, yDiff: y - yPos };
                    draft.end = { x, y };
                  })
                );
              }
            } else {
              updateContextMenuIsOpen({ value: false });
            }
          } else if (type === 'mousemove') {
            if (buttons === 1 && ctrlKey === false && metaKey === false) {
              if (isUpdatingEndRef.current) {
                setState(s =>
                  produce(s, draft => {
                    draft.end = { x, y };
                  })
                );
              }
            } else if (isUpdatingEndRef.current) {
              isUpdatingEndRef.current = false;
              setState(initialState);
            }
          } else if (type === 'mouseup') {
            if (isUpdatingEndRef.current) {
              isUpdatingEndRef.current = false;
              setState(initialState);
            }
          }
        }
      }
    }

    document.addEventListener('mousedown', handleEvent);
    document.addEventListener('mousemove', handleEvent);
    document.addEventListener('mouseup', handleEvent);
    () => {
      document.removeEventListener('mousedown', handleEvent);
      document.removeEventListener('mousemove', handleEvent);
      document.removeEventListener('mouseup', handleEvent);
    };
  }, []);

  useEffect(() => {
    const {
      keys: { ctrl, command },
      start: { hash, yDiff },
    } = state;

    if (hash) {
      if (ctrl == false && command === false) {
        const rectBound = getRectBound(state);
        const height = rectBound.height;
        let startIndex = hashList.indexOf(hash);
        let endIndex = startIndex + Math.floor((height + yDiff) / ROW_CELL_HEIGHT) + 1;
        if (rectBound.isYReverse) {
          endIndex = startIndex + 1;
          startIndex = startIndex - Math.floor((height + ROW_CELL_HEIGHT - yDiff) / ROW_CELL_HEIGHT);
        }

        if (startIndex !== currentRangeRef.current[0] || endIndex !== currentRangeRef.current[1]) {
          currentRangeRef.current = [startIndex, endIndex];

          const updateCurrentSection: string[] = [];
          const list = hashList.reduce((acc, hash, index) => {
            const isSelected = index >= startIndex && index < endIndex;
            if (isSelected) {
              updateCurrentSection.push(hash);
            }
            acc.push({
              type: 'absolute',
              item: torrentsRef.current[hash],
              isSelected,
            });
            return acc;
          }, [] as { type: 'absolute'; item: Torrent; isSelected: boolean }[]);

          updateTorrentSelectionList({ list });
        }
      } else {
        if (ctrl || command) {
          updateTorrentSelectionList({
            list: [{ type: 'relative', item: torrentsRef.current[hash] }],
          });
        }
      }
    }
  }, [state, hashList]);

  useEffect(() => {
    torrentsRef.current = collection;
  }, [collection]);

  return <div className={classes.rootContainer} style={getRectBound(state)}></div>;
};

function getRectBound(state: typeof initialState) {
  const { start, end } = state;
  let result = {
    top: start.y,
    left: start.x,
    width: end.x - start.x,
    height: end.y - start.y,
    isYReverse: false,
  };
  if (start.x > end.x) {
    result.left = end.x;
    result.width = start.x - end.x;
  }
  if (start.y > end.y) {
    result.top = end.y;
    result.height = start.y - end.y;
    result.isYReverse = true;
  }

  return result;
}

function getSelectionRange() {}
