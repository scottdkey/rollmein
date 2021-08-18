import React from "react"
import { Box } from "@chakra-ui/react"
import { Layout } from "../components/Layout";
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