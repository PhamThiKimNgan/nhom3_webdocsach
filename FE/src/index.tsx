import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { QueryClient, QueryClientProvider } from 'react-query'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});
ReactDOM.render(
  <QueryClientProvider client={queryClient} contextSharing={true}>
    <App />
  </QueryClientProvider>
  ,
  document.getElementById('root')
);
