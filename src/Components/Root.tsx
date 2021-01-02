import { render } from 'react-dom';
import { HashRouter, Switch, Route } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from 'react-query';
import { App } from './App';
import { Auth, Login } from './Auth';
import { ThemeProvider } from './ThemeProvider';

const queryClient = new QueryClient();

export const Root = () => {
  return (
    <Switch>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="*">
        <Auth>
          <App />
        </Auth>
      </Route>
    </Switch>
  );
};

export const renderApp = (rootElementQuerySelector = '#root') => {
  render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <HashRouter>
          <Root />
        </HashRouter>
      </ThemeProvider>
    </QueryClientProvider>,
    document.querySelector(rootElementQuerySelector)
  );
};
