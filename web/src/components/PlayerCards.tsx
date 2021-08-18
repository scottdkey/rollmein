import { Box, Spinner, Wrap, WrapItem, } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { PlayersQuery, usePlayersQuery } from "../generated/graphql";
import dynamic from "next/dynamic"
import { client } from "../lib/clients/graphqlRequestClient";
import { Player } from "./PlayerCard";

const PlayerCards = ({ }) => {
  const { data, isLoading } = usePlayersQuery<PlayersQuery, Error>(client);

  if (!isLoading && !data) {
    return <Box bg="red">Query Failed</Box>
  }
  const NewPlayerCard = dynamic(() => import("./NewPlayerCard"))
  const PlayerCard = dynamic(() => import("./PlayerCard"))

  return (
    <>
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
    </>
  )

}

export default PlayerCards