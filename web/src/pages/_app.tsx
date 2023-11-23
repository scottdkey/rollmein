
import { AppProps } from "next/app"
import { useState } from "react"
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from "react-query/devtools"
import ErrorBoundary from '../components/ErrorBoundary'
import { Layout } from "../components/Layout"
import { SessionProvider } from "next-auth/react"
function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{
  session: any
}>) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <>

      <QueryClientProvider client={queryClient}>
        <SessionProvider session={session}>
          <ErrorBoundary>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ErrorBoundary>
          <ReactQueryDevtools />
        </SessionProvider>
      </QueryClientProvider>
    </>

  );
}

export default App;
