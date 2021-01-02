import { StrictMode } from 'react';
import { render } from 'react-dom';
import { HashRouter, Switch, Route } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from 'react-query';
import { createIntl, createIntlCache, IntlProvider, RawIntlProvider } from 'react-intl';
import { App } from './App';
import { Auth, Login } from './Auth';
import { ThemeProvider } from './ThemeProvider';
import { storageGet } from '../utils';
import { AppContextProvider } from './State';

const clientLocaleSetting = storageGet('clientLocale', navigator.language);
const queryClient = new QueryClient();
const intlCache = createIntlCache();
const intl = createIntl(
  {
    locale: clientLocaleSetting,
    defaultLocale: clientLocaleSetting,
    messages: {},
  },
  intlCache
);

export const Root = () => {
  return (
    <IntlProvider locale="en-US">
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="*">
          <Auth>
            <AppContextProvider>
              <App />
            </AppContextProvider>
          </Auth>
        </Route>
      </Switch>
    </IntlProvider>
  );
};

export const renderApp = (rootElementQuerySelector = '#root') => {
  render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <HashRouter>
            <RawIntlProvider value={intl}>
              <Root />
            </RawIntlProvider>
          </HashRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>,
    document.querySelector(rootElementQuerySelector)
  );
};
