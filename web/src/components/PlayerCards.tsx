import { Box, Spinner, Wrap, WrapItem, } from "@chakra-ui/react"
import React, { FC, useEffect, useState } from "react"
import { PlayersQuery, usePlayersQuery } from "../generated/graphql";

import { client } from "../lib/clients/graphqlRequestClient";
import PlayerCard, { Player } from "./PlayerCard";
import NewPlayerCard from "./NewPlayerCard";


const PlayerCards = ({ }) => {
  const { data, isLoading } = usePlayersQuery<PlayersQuery, Error>(client);
  const [players, setPlayers] = useState<Player[]>([
    {
      id: 1,
      name: "test",
      tank: true,
      healer: true,
      dps: true,
      locked: true,
      inTheRoll: true
    }
  ])

  if (!isLoading && !data) {
    return <Box bg="red">Query Failed</Box>
  }




  return (
    <>
      <Wrap spacing="5px" align="center" m="5px" justify="center">
        {players.map((player, index) => <PlayerCard key={player.name} playerId={player.id} />)}
        <WrapItem>
          <NewPlayerCard />
        </WrapItem>
      </Wrap>
    </>
  )

}

export default PlayerCards