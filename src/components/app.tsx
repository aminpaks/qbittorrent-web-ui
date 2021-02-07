import { FC } from 'react';
import { mStyles } from './common';
import { useAppVersionQuery } from './data';
import { MainLayout } from './layout';
import Sidebar from './sidebar';
import TorrentsContainer from './torrents';

const useStyles = mStyles(() => ({
  torrentContainer: {
    height: '100%',
  },
}));

export const App: FC = () => {
  const classes = useStyles();
  const { data: qbtVersion } = useAppVersionQuery();

  return (
    <MainLayout qbtVersion={qbtVersion || ''} sideBar={<Sidebar />}>
      <TorrentsContainer />
    </MainLayout>
  );
};
