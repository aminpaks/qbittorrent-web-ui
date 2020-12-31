import { render } from 'react-dom';
import { QueryClientProvider, QueryClient } from 'react-query';
import { Auth } from './Auth';

const queryClient = new QueryClient();

export const App = () => {
  return (
    <div>
      <div>qBittorrent Web UI</div>
      <Auth />
    </div>
  );
};

export const renderApp = (rootElementQuerySelector = '#root') => {
  render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>,
    document.querySelector(rootElementQuerySelector)
  );
};
