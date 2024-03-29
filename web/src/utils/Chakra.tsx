// e.g. src/Chakra.js
// a) import `ChakraProvider` component as well as the storageManagers
import {
  ChakraProvider,
  cookieStorageManager,
  cookieStorageManagerSSR,
  localStorageManager,
} from '@chakra-ui/react'

export function Chakra({ cookies, children }: { cookies: any, children: JSX.Element }) {
  // b) Pass `colorModeManager` prop
  const colorModeManager =
    typeof cookies === 'string'
      ? cookieStorageManager
      : localStorageManager

  return (
    <ChakraProvider colorModeManager={colorModeManager}>
      {children}
    </ChakraProvider>
  )
}

// also export a reusable function getServerSideProps
export function getServerSideProps({ req }: { req: any }) {
  return {
    props: {
      // first time users will not have any cookies and you may not return
      // undefined here, hence ?? is necessary
      cookies: req.headers.cookie ?? '',
    },
  }
}