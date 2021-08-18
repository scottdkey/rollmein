import React, { useEffect } from "react"
import { Spinner, Wrap, WrapItem, } from "@chakra-ui/react"
import { Layout } from "../components/Layout";
import dynamic from "next/dynamic"
import { PlayersQuery, useMeQuery, usePlayersQuery } from "../generated/graphql";
import { Player } from "../components/PlayerCard";
import { client } from "../lib/clients/graphqlRequestClient";
import { useAuth } from "../providers/AuthProvider";

const Index = () => {

  const { data, isLoading } = usePlayersQuery<PlayersQuery, Error>(client);
  const NewPlayerCard = dynamic(() => import("../components/NewPlayerCard"))
  const PlayerCard = dynamic(() => import("../components/PlayerCard"))

  return (
    <Layout>
      {
        !data && isLoading ?
          <Spinner size="xl" />
          :
          <Wrap spacing="5px" align="center" m="5px" justify="center">
            {data?.players.map((p: Player) =>
              <WrapItem key={p.id}>
                <PlayerCard player={p} />
              </WrapItem>
            )}
            <WrapItem>
              <NewPlayerCard />
            </WrapItem>
          </Wrap>
      }
    </Layout>
  )
}

export default Index;