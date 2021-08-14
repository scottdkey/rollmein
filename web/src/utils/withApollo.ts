import { createWithApollo } from "./createWithApollo";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { NextPageContext } from "next";
import { isServer } from "./constants";
import { getCookie } from "./cookieHelpers";


const token = !isServer() ? getCookie() : null

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL as string,
  fetchOptions: {
    credentials: "include"
  },
  headers: {
    ...Headers,
    authorization: token ? token : ""
  }
})
const createClient = (ctx: NextPageContext) =>
  new ApolloClient({
    credentials: 'include',
    ssrMode: isServer(),
    link: httpLink,
    cache: new InMemoryCache(),
  });

export const withApollo = createWithApollo(createClient);
