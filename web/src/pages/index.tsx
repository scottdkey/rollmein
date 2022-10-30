import React from "react"
import { VStack } from "@chakra-ui/react"
import { Layout } from "../components/Layout";
import { useAuth } from "../providers/AuthProvider";
import dynamic from "next/dynamic";
import { Groups } from "../components/Groups";


const Index = () => {


  return (
    <Layout>
      <Groups />
    </Layout>
  )
}

export default Index;