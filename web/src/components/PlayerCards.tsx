import { Box, Spinner, Wrap, WrapItem, } from "@chakra-ui/react"
import React, { FC, useEffect, useState } from "react"
import { PlayersQuery, usePlayersQuery } from "../generated/graphql";

import { client } from "../lib/clients/graphqlRequestClient";
import { Player } from "./PlayerCard";
import NewPlayerCard from "./NewPlayerCard";
import dynamic from "next/dynamic";


const PlayerCards = ({ }) => {
  const { data, isLoading } = usePlayersQuery<PlayersQuery, Error>(client);
  const [players, setPlayers] = useState<Player[]>([
    {
      id: 0,
      name: "test",
      tank: true,
      healer: true,
      dps: true,
      locked: true,
      inTheRoll: true
    }
  ])
  // useEffect(() => {
  //   console.log(isLoading)

  // },[])

  const PlayerCard = dynamic(() => import('./PlayerCard'))

  if (!isLoading && !data) {
    return <Box bg="red">Query Failed</Box>
  }

  return (
    <>
      <Wrap spacing="5px" align="center" m="5px" justify="center">
        {data?.players.map((player) => <PlayerCard key={player.id} playerId={player.id} />)}
        <WrapItem>
          <NewPlayerCard />
        </WrapItem>
      </Wrap>
    </>
  )

}

export default PlayerCards