import { Box, Spinner, Wrap, WrapItem, } from "@chakra-ui/react"
import React from "react"
import { PlayersQuery, usePlayersQuery } from "../generated/graphql";

import { client } from "../lib/clients/graphqlRequestClient";
import PlayerCard, { Player } from "./PlayerCard";
import NewPlayerCard from "./NewPlayerCard";

const PlayerCards = ({ }) => {
  const { data, isLoading } = usePlayersQuery<PlayersQuery, Error>(client);

  if (!isLoading && !data) {
    return <Box bg="red">Query Failed</Box>
  }

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