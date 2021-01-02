import { FC } from 'react';
import { getErrorMessage } from '../api';
import { DisplayError } from './DisplayError';

export const DisplayApiError: FC<{ error: unknown }> = ({ error }) => {
  return error ? <DisplayError title="Failure" message={getErrorMessage(error)} /> : null;
};
