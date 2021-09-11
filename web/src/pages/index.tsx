import React from "react"
import { VStack } from "@chakra-ui/react"
import { Layout } from "../components/Layout";
import { useAuth } from "../providers/AuthProvider";
import dynamic from "next/dynamic";


const Index = () => {

  const { auth } = useAuth()
  const PlayerCards = dynamic(() => import('../components/PlayerCards'))
  const Rolls = dynamic(() => import('../components/Rolls'))

  return (
    <Layout>
      {
        !auth ?
          null
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