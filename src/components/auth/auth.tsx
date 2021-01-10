import { FC, ReactElement, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAppVersionQuery } from '../data';

export const Auth: FC<{ children: ReactElement }> = ({ children }) => {
  const history = useHistory();
  const { pathname: currentPath } = useLocation();
  const { data, isSuccess: isAuthenticated, isFetching } = useAppVersionQuery();

  useEffect(() => {
    if (!isFetching && !isAuthenticated) {
      if (currentPath !== '/login') {
        history.push('/login');
      }
    }
  }, [isFetching, isAuthenticated, currentPath, history]);

  if (isFetching) {
    return <div>Loading...</div>;
  }

  if (!isFetching && !isAuthenticated) {
    return null;
  }

  if (data) {
    return children;
  }

  return null;
};
