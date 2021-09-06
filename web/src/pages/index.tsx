import React from "react"
import { Flex, Spinner, VStack } from "@chakra-ui/react"
import { Layout } from "../components/Layout";
import { useAuth } from "../providers/AuthProvider";
import PlayerCards from "../components/PlayerCards";
import Rolls from "../components/Rolls";


const Index = () => {

  const { auth } = useAuth()

  return (
    <Layout>
      {
        !auth ?
          <Spinner />
          :
          <VStack >
            <PlayerCards />
            <Rolls />
          </VStack>
      }


    </Layout>
  )
}

export default Index;