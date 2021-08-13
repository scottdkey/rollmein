import { createWithApollo } from "./createWithApollo";
import { ApolloClient, InMemoryCache, ApolloLink, HttpLink } from "@apollo/client";
import { NextPageContext } from "next";
import { isServer } from "./varables";

const createClient = (ctx: NextPageContext) =>
  new ApolloClient({
    credentials: 'include',
    ssrMode: isServer(),
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_API_URL as string,
      fetchOptions: {
        credentials: "include"
      }
      
    }),
    cache: new InMemoryCache(),
  });

export const withApollo = createWithApollo(createClient);