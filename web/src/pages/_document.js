// pages/_document.js

import { ColorModeScript, StyleFunctionProps, extendTheme } from '@chakra-ui/react'
import NextDocument, { Html, Head, Main, NextScript } from 'next/document'
import { mode } from '@chakra-ui/theme-tools'

export const theme = extendTheme({
  global: (props) => ({
    body: {
      fontFamily: 'body',
      color: mode('gray.800', 'whiteAlpha.300')(props),
      bg: mode('gray.200', 'blue.800')(props),
      lineHeight: 'base',
    },
  }),
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
})
export default class Document extends NextDocument {
  render() {
    return (
      <Html lang='en'>
        <Head />
        <body>
          {/* 👇 Here's the script */}
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}