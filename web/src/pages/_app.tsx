import {
  CSSReset, ChakraProvider
} from "@chakra-ui/react"
import { AppProps } from "next/app"
import { SessionProvider } from "next-auth/react"
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from "react-query/devtools"
import { theme } from "./_document"
import { Session } from "next-auth"


function App({ Component, pageProps: { session, ...pageProps } }: AppProps<{ session: Session }>) {
  const queryClient = new QueryClient()
  return (
    <>
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>

          <ChakraProvider theme={theme}>
            <CSSReset />
            <Component {...pageProps} />
          </ChakraProvider>

          <ReactQueryDevtools />
        </QueryClientProvider>
      </SessionProvider>
    </>

  );
}

export default App;
