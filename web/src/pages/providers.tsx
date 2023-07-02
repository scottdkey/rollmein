// app/providers.tsx
'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { CSSReset, ChakraProvider, theme } from '@chakra-ui/react'
import { Session, createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState, Component } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/types/devtools'
import ErrorBoundary from '../components/ErrorBoundary'
import { Layout } from '../components/Layout'
import { AppProps } from 'next/app'

export function Providers({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session
}>) {
  const [queryClient] = useState(() => new QueryClient())
  const [supabaseClient] = useState(createPagesBrowserClient())
  return (

    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <QueryClientProvider client={queryClient}>
        <CacheProvider>
          <CSSReset />
          <ChakraProvider theme={theme}>
            <ErrorBoundary>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ErrorBoundary>
          </ChakraProvider>
        </CacheProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </SessionContextProvider>
  )
}
