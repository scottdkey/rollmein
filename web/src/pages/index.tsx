import React from "react"
import { Box, Spinner, Wrap, WrapItem, } from "@chakra-ui/react"
import { Layout } from "../components/Layout";
import { withApollo } from "../utils/withApollo";
import dynamic from "next/dynamic"
import { usePlayersQuery } from "../generated/graphql";


export type Player = {
  id: string,
  name: string,
  tank: boolean,
  healer: boolean,
  dps: boolean,
  inTheRoll: boolean,
  locked: boolean
}
const Index = () => {
  const { data, loading } = usePlayersQuery();

  const NewPlayerCard = dynamic(() => import("../components/NewPlayerCard"))
  const PlayerCard = dynamic(() => import("../components/PlayerCard"))

  return (
    <Layout>
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
    </Layout>
  )
}

export default withApollo({ ssr: false })(Index);