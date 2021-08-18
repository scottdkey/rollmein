import { useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { client } from "../lib/clients/graphqlRequestClient";
import { useAuth } from "../providers/AuthProvider";

export const useIsAuth = () => {
  const { data, isLoading } = useMeQuery(client);
  const { setAuth } = useAuth()
  const router = useRouter();
  useEffect(() => {
    if (!isLoading && !data?.me) {
      router.replace("/login");
    } else {
      setAuth(true)
    }
  }, [isLoading, data, router]);
};