import React, { useEffect } from "react"
import { Box, Spinner, Wrap, WrapItem, } from "@chakra-ui/react"
import { Layout } from "../components/Layout";
import dynamic from "next/dynamic"
import { PlayersQuery, useMeQuery, usePlayersQuery } from "../generated/graphql";
import { Player } from "../components/PlayerCard";
import { client } from "../lib/clients/graphqlRequestClient";
import { useAuth } from "../providers/AuthProvider";
import PlayerCards from "../components/PlayerCards";

const Index = () => {

  const { auth } = useAuth()

  return (
    <Layout>
      {
        !auth ?
          <Box>Please Login to continue</Box>
          :
          <PlayerCards />
      }
    </Layout>
  )
}

export default Index;