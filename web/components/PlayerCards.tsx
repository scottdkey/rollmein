import { Spinner, Wrap, WrapItem } from "@chakra-ui/react"
import { withUrqlClient } from "next-urql";
import React from "react"
import { usePlayersQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { Layout } from "./Layout";
import { PlayerCard } from "./PlayerCard"


const PlayerCards = ({}) => {
  const [{ data, fetching }] = usePlayersQuery();

  if (!fetching && !data) {
    return <div>query failed for some reason</div>
  }
  return (
    <Layout>
      {
        !data && fetching ?
          <Spinner size="xl" />
          :
          <Wrap spacing="5px" align="center" m="5px" justify="center">
            {data?.players.map(p =>
              <WrapItem >
                <PlayerCard player={p} />
              </WrapItem>
            )}
          </Wrap>
      }
    </Layout>

  )
}

export default withUrqlClient(createUrqlClient, { ssr: false })(PlayerCards)