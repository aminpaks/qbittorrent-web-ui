import { FC } from 'react';
import { useAppVersionQuery } from './Data';
import { MainLayout } from './Layout';

export const App: FC = () => {
  const { data: qbtVersion } = useAppVersionQuery();

  return (
    <MainLayout qbtVersion={qbtVersion || ''}>
      <div>Application main window</div>
    </MainLayout>
  );
};
