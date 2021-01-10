import { FC } from 'react';
import { mStyles } from './common';
import { useAppVersionQuery } from './data';
import { MainLayout } from './layout';
import TorrentsContainer from './torrents';

const useStyles = mStyles(() => ({
  torrentContainer: {
    width: '100%',
    flex: '1 0 auto',
  },
}));

export const App: FC = () => {
  const classes = useStyles();
  const { data: qbtVersion } = useAppVersionQuery();

  return (
    <MainLayout qbtVersion={qbtVersion || ''}>
      <div className={classes.torrentContainer}>
        <TorrentsContainer />
      </div>
    </MainLayout>
  );
};
