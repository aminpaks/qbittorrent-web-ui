import { FC, ReactNode, useRef, useState } from 'react';

import { mStyles } from '../common';
import { colorAlpha, getClientRect, isEventType } from '../../utils';
import { TorrentContents } from './contents';
import { useDocumentEvents } from '../utils';

const useStyles = mStyles(() => ({
  mainRoot: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
  },
  list: {
    position: 'relative',
    flex: '1 1 0px',
  },
  details: {
    flex: '0 0 auto',
    position: 'relative',
    borderTop: `1px solid transparent`,
    borderTopColor: colorAlpha('#000', 0.02).string(),

    '&::before': {
      top: 0,
      left: 0,
      width: '100%',
      height: 1,
      display: 'block',
      content: '""',
      position: 'absolute',
      backgroundColor: '#fff',
    },
  },
  detailResize: {
    top: 0,
    left: 0,
    width: '100%',
    height: 2,
    position: 'absolute',
    background: 'transparent',
    transition: 'ease 180ms',
    cursor: 'row-resize',

    '&:hover': {
      height: 4,
      background: 'blue',
    },
  },
}));

export const TorrentDetails: FC<{ list: ReactNode }> = ({ list }) => {
  const classes = useStyles();
  const detailsRef = useRef(null as HTMLDivElement | null);
  const [state, setState] = useState({ top: 0, detailsHeight: 0, detailsNewHeight: 0, isResizing: false });
  const { top, detailsHeight, detailsNewHeight, isResizing } = state;

  useDocumentEvents(
    event => {
      if (isResizing) {
        const curTop = isEventType('mousemove', event) ? event.clientY : event.changedTouches[0].clientY;
        console.log('event', { curTop });
        const newHeight =
          Math.abs(curTop > top ? curTop - top : top - curTop) * (curTop > top ? -1 : 1) + detailsHeight;
        console.log({ newHeight, curTop, top });
        if (newHeight > 60 && newHeight < 800) {
          setState(s => ({ ...s, detailsNewHeight: newHeight }));
        }
      }
    },
    ['mousemove', 'touchend']
  );
  useDocumentEvents(() => {
    if (isResizing) {
      setState(s => ({ ...s, isResizing: false }));
    }
  }, ['mouseup', 'touchend']);

  return (
    <div className={classes.mainRoot}>
      <div className={classes.list}>{list}</div>
      <div
        ref={detailsRef}
        className={classes.details}
        style={{ flexBasis: detailsNewHeight === 0 ? 'auto' : detailsNewHeight }}
      >
        <div
          className={classes.detailResize}
          onTouchStart={() => {
            if (!isResizing) {
              // const { clientY: top } = event;
              const { height: detailsHeight, top } = getClientRect(detailsRef.current);
              setState(s => ({ ...s, top, detailsHeight, isResizing: true }));
            }
          }}
          onMouseDown={() => {
            if (!isResizing) {
              // const { clientY: top } = event;
              const { height: detailsHeight, top } = getClientRect(detailsRef.current);
              setState(s => ({ ...s, top, detailsHeight, isResizing: true }));
            }
          }}
        ></div>
        <TorrentContents />
      </div>
    </div>
  );
};
