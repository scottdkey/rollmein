import { CSSReset, ChakraProvider } from "@chakra-ui/react"




function App({ Component, pageProps }: any) {
  return (
    <ChakraProvider>
      <CSSReset />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default App;
