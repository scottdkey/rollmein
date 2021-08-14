import { Box, Spinner, Wrap, WrapItem, } from "@chakra-ui/react"
import React, { useEffect } from "react"
import { usePlayersQuery } from "../generated/graphql";
import dynamic from "next/dynamic"
import { withApollo } from "../utils/withApollo";

export type Player = {
  id: string,
  name: string,
  tank: boolean,
  healer: boolean,
  dps: boolean,
  inTheRoll: boolean,
  locked: boolean
}
const PlayerCards = ({ }) => {
  const { data, loading } = usePlayersQuery();

  if (!loading && !data) {
    return <Box bg="red">Query Failed</Box>
  }
  const NewPlayerCard = dynamic(() => import("./NewPlayerCard"))
  const PlayerCard = dynamic(() => import("./PlayerCard"))
  console.log(data)

  return (
    <>
      {
        !data && loading ?
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

export default withApollo({ ssr: false })(PlayerCards);