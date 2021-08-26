import { Box, Spinner, Wrap, WrapItem, } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { PlayersQuery, usePlayersQuery } from "../generated/graphql";

import { client } from "../lib/clients/graphqlRequestClient";
import NewPlayerCard from "./NewPlayerCard";
import dynamic from "next/dynamic";
import { Player } from "./PlayerCard";


const PlayerCards: React.FC = ({ }): JSX.Element => {
  const { data, isLoading } = usePlayersQuery<PlayersQuery, Error>(client);
  const PlayerCard = dynamic(() => import('./PlayerCard'))
  const [players, setPlayers] = useState<number[] | undefined>()

  useEffect(() => {
    if (data?.players) {
      const returnArray = data.players.map(p => {
        return p.id
      })
      setPlayers(returnArray)
    }
  }, [data?.players])

  const deletePlayer = (id: number) => {
    const newPlayers = players?.filter(p => {
      p = id
    })
    setPlayers(newPlayers)
  }

  if (isLoading) {
    return <Box><Spinner /></Box>
  } else if (!isLoading && !data) {
    return <Box bg="red">Query Failed</Box>
  } else {
    return (
      <Wrap spacing="5px" align="center" m="5px" justify="center">
        {players?.map((player) =>
          <WrapItem key={player} >
            <PlayerCard playerId={player} deletePlayer={deletePlayer} />
          </WrapItem>)}
        <WrapItem>
          <NewPlayerCard />
        </WrapItem>
      </Wrap>
    )
  }

}

export default PlayerCards