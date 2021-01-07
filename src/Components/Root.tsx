import { StrictMode } from 'react';
import { render } from 'react-dom';
import { HashRouter, Switch, Route } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from 'react-query';
import { App } from './App';
import { Auth, Login } from './Auth';
import { ThemeProvider } from './ThemeProvider';
import { AppContextProvider } from './State';
import { AppIntlProvider } from './Intl';
import Notifications, { NotificationsProvider } from './notifications';

const queryClient = new QueryClient();

const Root = () => {
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
                <Root />
              </NotificationsProvider>
            </AppIntlProvider>
          </HashRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>,
    document.querySelector(rootElementQuerySelector)
  );
};
