import { StrictMode, useEffect } from 'react';
import { render } from 'react-dom';
import { useIntl } from 'react-intl';
import { HashRouter, Switch, Route } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from 'react-query';
import { App } from './app';
import { Auth, Login } from './auth';
import { ThemeProvider } from './theme-provider';
import { AppContextProvider, UiStateProvider } from './state';
import { AppIntlProvider } from './intl';
import Notifications, { NotificationsProvider, useNotifications } from './notifications';

const queryClient = new QueryClient();

const Root = () => {
  const { formatMessage } = useIntl();
  const { create } = useNotifications();
  useEffect(() => {
    create({
      message: formatMessage({ defaultMessage: `Welcome to qBittorrent` }),
    });
  }, []);

  return (
    <>
      <Notifications />
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
    </>
  );
};

export const renderApp = async (rootElementQuerySelector = '#root') => {
  render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <HashRouter>
            <AppIntlProvider>
              <NotificationsProvider>
                <UiStateProvider>
                  <Root />
                </UiStateProvider>
              </NotificationsProvider>
            </AppIntlProvider>
          </HashRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>,
    document.querySelector(rootElementQuerySelector)
  );
};
