import { CSSReset, ChakraProvider } from "@chakra-ui/react"
import { AppProps } from "next/app"
import { AuthProvider } from "../providers/AuthProvider"

import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from "react-query/devtools"



const queryClient = new QueryClient()


function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <CSSReset />
        <AuthProvider >
          <Component {...pageProps} />
        </AuthProvider>
      </ChakraProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
