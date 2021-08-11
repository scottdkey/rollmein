import { Box, Spinner, Wrap, WrapItem, } from "@chakra-ui/react"
import { withUrqlClient } from "next-urql";
import React from "react"
import { usePlayersQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { NewPlayerCard } from "./NewPlayerCard";
import { PlayerCard } from "./PlayerCard"


const PlayerCards = ({ }) => {
  const [{ data, fetching }] = usePlayersQuery();

  if (!fetching && !data) {
    return <Box bg="red">Query Failed</Box>
  }
  return (
    <>
      {
        !data && fetching ?
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

export default withUrqlClient(createUrqlClient, { ssr: false })(PlayerCards)