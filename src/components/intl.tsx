import { FC, useState } from 'react';
import { useQuery } from 'react-query';
import { IntlProvider } from 'react-intl';
import { PUBLIC_URL } from '../constant';
import { getClientLocale, getLanguageSubtag } from '../utils';
import { buildError, rawRequest } from '../api';

export const AppIntlProvider: FC = ({ children }) => {
  const [locale, setLocal] = useState(() => getClientLocale());
  const { data: messages, isFetching } = useQuery(
    ['app-intl', locale],
    async () => {
      const response = await rawRequest(`${PUBLIC_URL}/lang/${getLanguageSubtag(locale)}.json`);

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
