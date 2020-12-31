import { FC } from 'react';
import { useAuthData } from '../Data';
import { API_PASSWORD, API_USERNAME } from '../../constant';

export const Auth: FC = () => {
  const { data, error, isError } = useAuthData(API_USERNAME, API_PASSWORD);

  return (
    <pre>
      <code>{JSON.stringify(isError ? error : data, null, 2)}</code>
    </pre>
  );
};
