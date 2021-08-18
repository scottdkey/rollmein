import { CSSReset, ChakraProvider } from "@chakra-ui/react"
import { AppProps } from "next/app"
import { AuthProvider } from "../providers/AuthProvider"

import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from "react-query/devtools"


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 1000,
    }
  }
})
function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <AuthProvider>
          <CSSReset />
          <Component {...pageProps} />
        </AuthProvider>
      </ChakraProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider >
  );
}

export default App;
