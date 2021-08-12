import { CSSReset, ChakraProvider } from "@chakra-ui/react"
import { AppProps } from "next/app"
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../utils/apollo";




function App({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps)
  return (
    <ChakraProvider>
      <ApolloProvider client={apolloClient}>
        <CSSReset />
        <Component {...pageProps} />
      </ApolloProvider>
    </ChakraProvider>
  );
}

export default App;
