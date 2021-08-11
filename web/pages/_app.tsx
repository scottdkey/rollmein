import { CSSReset, ChakraProvider } from "@chakra-ui/react"
import {withUrqlClient} from "next-urql"
import { createUrqlClient } from "../utils/createUrqlClient";




function App({ Component, pageProps }: any) {
  return (
    <ChakraProvider>
      <CSSReset />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default withUrqlClient(createUrqlClient, {})(App);
