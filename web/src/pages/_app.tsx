import {
  CSSReset, ChakraProvider
} from "@chakra-ui/react"
import { AppProps } from "next/app"
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from "react-query/devtools"
import { theme } from "./_document"
import { Layout } from "../components/Layout"
import { useState } from "react"
import ErrorBoundary from '../components/ErrorBoundary'
import { SessionContextProvider } from "@supabase/auth-helpers-react"
import { Session, createPagesBrowserClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "../../types_db"

export const supabaseBrowser = () => createPagesBrowserClient<Database>()

function App({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session
}>) {
  const [queryClient] = useState(() => new QueryClient())
  const [supabaseClient] = useState(supabaseBrowser())

  return (
    <>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <QueryClientProvider client={queryClient}>
          <ChakraProvider theme={theme}>
            <CSSReset />
            <ErrorBoundary>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ErrorBoundary>
          </ChakraProvider>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </SessionContextProvider>
    </>

  );
}

export default App;
