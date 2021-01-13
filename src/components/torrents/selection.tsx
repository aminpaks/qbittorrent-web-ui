import produce from 'immer';
import { useEffect, useRef, useState } from 'react';
import { useTorrentList, useUiState } from '../state';
import { ROW_CELL_HEIGHT } from './list';
import { color, getElementAttr } from '../../utils';
import { mStyles } from '../common';

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
    shift: false,
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
  const hashList = useTorrentList();
  const [{ torrentListSelection }, { updateTorrentSelectionList, updateContextMenuIsOpen }] = useUiState();
  const [state, setState] = useState(initialState);
  const isUpdatingEndRef = useRef(false);
  const currentRangeRef = useRef([0, 0] as [number, number]);
  const currentSelectionRef = useRef([] as string[]);

  useEffect(() => {
    currentSelectionRef.current = torrentListSelection;
  });

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
        metaKey,
        shiftKey,
      } = event;
      if (isTrusted) {
        if (target) {
          if (type === 'mousedown' && (button !== 2 || ctrlKey || metaKey || shiftKey)) {
            const hash = getElementAttr('data-torrent-hash', '', target as Element);
            if (hash) {
              if (!isUpdatingEndRef.current) {
                const { y: yPos } = (target as Element).getBoundingClientRect();
                isUpdatingEndRef.current = true;

                setState(s =>
                  produce(s, draft => {
                    draft.keys = { ctrl: ctrlKey, command: metaKey, shift: shiftKey };
                    draft.start = { x, y, hash, yDiff: y - yPos };
                    draft.end = { x, y };
                  })
                );
              }
            } else {
              const action = getElementAttr('data-action', '', target as Element);
              if (!action) {
                updateContextMenuIsOpen({ value: false });
              }
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
      keys: { ctrl, command, shift },
      start: { hash, yDiff },
    } = state;

    if (hash) {
      if (ctrl == false && command === false && shift === false) {
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
              hash,
              isSelected,
            });
            return acc;
          }, [] as { hash: string; isSelected: boolean }[]);

          updateTorrentSelectionList({ type: 'absolute', list });
        }
      } else if (shift) {
        let [startIndex, endIndex] = currentRangeRef.current;
        const currentIndex = hashList.indexOf(hash);
        if (startIndex > currentIndex) {
          startIndex = currentIndex;
        } else {
          endIndex = currentIndex + 1;
        }
        updateTorrentSelectionList({
          type: 'only',
          list: hashList.slice(startIndex, endIndex),
        });
      } else {
        if (ctrl || command) {
          updateTorrentSelectionList({
            type: 'relative',
            list: [hash],
          });
        }
      }
    }
  }, [state, hashList]);

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
