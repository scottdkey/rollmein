import React from "react"
import { Box, Circle } from "@chakra-ui/react"
import { Layout } from "../components/Layout";
import { useAuth } from "../providers/AuthProvider";
import PlayerCards from "../components/PlayerCards";
import { FirstAid, Dice, Lock, Trash } from "../assets";

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