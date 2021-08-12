import { Box, Spinner, Wrap, WrapItem, } from "@chakra-ui/react"
import React from "react"
import { usePlayersQuery } from "../generated/graphql";
import { NewPlayerCard } from "./NewPlayerCard";
import { PlayerCard } from "./PlayerCard"


const PlayerCards = ({ }) => {
  const { data, error, loading, fetchMore, variables } = usePlayersQuery();

  if (!loading && !data) {
    return <Box bg="red">Query Failed</Box>
  }
  return (
    <>
      {
        !data && loading ?
          <Spinner size="xl" />
          :
          <Wrap spacing="5px" align="center" m="5px" justify="center">
            {data?.players.map(p =>
              <WrapItem key={p.id}>
                <PlayerCard player={p} />
              </WrapItem>
            )}
            <NewPlayerCard />
          </Wrap>
      }
    </>
  )
}

export default PlayerCards