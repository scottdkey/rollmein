import { CSSReset, ChakraProvider } from "@chakra-ui/react"
import { AppProps } from "next/app"
import { AuthProvider } from "../providers/AuthProvider"

import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from "react-query/devtools"
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';



// const queryClient = new QueryClient()
const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_URL,
  cache: new InMemoryCache(),
});


function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <ChakraProvider>
        <AuthProvider>
          <CSSReset />
          <Component {...pageProps} />
        </AuthProvider>
      </ChakraProvider>
    </ApolloProvider >
  );
}

export default App;
