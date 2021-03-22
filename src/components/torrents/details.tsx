import { FC, ReactNode } from 'react';
import { colorAlpha } from '../../utils';
import { mStyles } from '../common';

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
}));

export const TorrentDetails: FC<{ list: ReactNode }> = ({ list }) => {
  const classes = useStyles();

  return (
    <div className={classes.mainRoot}>
      <div className={classes.list}>{list}</div>
      <div className={classes.details}>
        something here
        <br />
        chceck
      </div>
    </div>
  );
};
