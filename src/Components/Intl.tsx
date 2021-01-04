import { FC, useState } from 'react';
import { useQuery } from 'react-query';
import { IntlProvider } from 'react-intl';
import { PUBLIC_URL } from '../constant';
import { storageGet, tryCatchSync } from '../utils';
import { buildError, rawRequest } from '../api';

const getStandardLocaleFilename = (locale: string) => tryCatchSync(() => locale.split('-')[0], 'en');

export const AppIntlProvider: FC = ({ children }) => {
  const [locale, setLocal] = useState(
    storageGet('clientLocale', () => tryCatchSync(() => navigator.language, 'en-US'))
  );
  const { data: messages, isFetching } = useQuery(
    ['app-intl', locale],
    async () => {
      const response = await rawRequest(`${PUBLIC_URL}/lang/${getStandardLocaleFilename(locale)}.json`);

      if (response.ok) {
        return response.json();
      }

      throw buildError('Fail to initialize internationalization!', { response });
    },
    {
      retry: 0,
      refetchOnMount: false,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );

  if (isFetching) {
    return null;
  }

  return (
    <IntlProvider locale={locale} messages={messages}>
      {children}
    </IntlProvider>
  );
};
