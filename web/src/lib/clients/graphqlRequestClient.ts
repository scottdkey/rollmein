import { GraphQLClient } from "graphql-request";
import { HeaderOptions } from "../../providers/AuthProvider";
import { isServer } from "../../utils/constants";
import { getCookie } from "../../utils/cookieHelpers";

let token: string | undefined = undefined
if (process.browser) {
  if (document.cookie !== "") {
    token = !isServer() ? getCookie() : undefined

  }
}

const headerOptions: HeaderOptions | undefined = token === undefined ? undefined : {
  headers: {
    authorization: `Bearer ${token}`
  }
}
export const client = new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!, headerOptions)
