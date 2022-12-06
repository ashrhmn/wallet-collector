import { AppProps } from 'next/app';
import '../global.css';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NavBar from '../components/NavBar';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App({ Component, pageProps }: AppProps) {
  const client = new QueryClient();
  return (
    <div className="text-xl">
      <QueryClientProvider client={client}>
        <NavBar />
        <main className="pt-20">
          <Component {...pageProps} />
        </main>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
