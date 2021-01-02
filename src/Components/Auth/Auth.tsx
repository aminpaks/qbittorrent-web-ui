import { FC, ReactElement } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAppVersionQuery } from '../Data';

export const Auth: FC<{ children: ReactElement }> = ({ children }) => {
  const history = useHistory();
  const { pathname: currentPath } = useLocation();
  const { data, isSuccess: isAuthenticated, isFetching } = useAppVersionQuery();

  if (isFetching) {
    <div>Loading...</div>;
  }

  if (!isFetching && !isAuthenticated) {
    if (currentPath !== '/login') {
      history.push('/login');
    }
    return null;
  }

  if (data) {
    return children;
  }

  return null;
};
