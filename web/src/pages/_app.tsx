import {
  CSSReset, ChakraProvider
} from "@chakra-ui/react"
import { AppProps } from "next/app"
import { SessionProvider } from "next-auth/react"
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from "react-query/devtools"
import { theme } from "./_document"
import { Session } from "next-auth"
import { Layout } from "../components/Layout"


function App({ Component, pageProps: { session, ...pageProps } }: AppProps<{ session: Session }>) {
  const queryClient = new QueryClient()
  return (
    <>
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider theme={theme}>
            <CSSReset />
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ChakraProvider>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </SessionProvider>
    </>

  );
}

export default App;
