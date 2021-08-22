import { useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { client } from "../lib/clients/graphqlRequestClient";

export const useIsAuth = () => {
  const { data, isLoading } = useMeQuery(client);
  const router = useRouter();
  if (!isLoading && !data?.me) {
    router.replace("/login");
  }
};