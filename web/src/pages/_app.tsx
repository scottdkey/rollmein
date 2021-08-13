import { CSSReset, ChakraProvider } from "@chakra-ui/react"
import { AppProps } from "next/app"




function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <CSSReset />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default App;
