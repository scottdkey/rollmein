export const isServer = () => typeof window === 'undefined'
export const isProd = () => process.env.NODE_ENV === "production"
export const isDev = () => process.env.NODE_ENV === "development"
export const graphqlEndpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ? process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT : "http://localhost:5000/graphql"