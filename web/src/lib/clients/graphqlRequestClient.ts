import { GraphQLClient } from "graphql-request"
import { isServer } from "../../utils/constants"
import { getCookie } from "../../utils/cookieHelpers"


const token = !isServer() ? getCookie() : null
const requestHeaders = {
  authorization: `Bearer ${token}`
}

export const client = new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT as string, {
  headers: requestHeaders
})
