import React from "react"
import PlayerCards from "../components/PlayerCards"
import { Layout } from "../components/Layout";
import { withApollo } from "../utils/withApollo";
import { Box } from "@chakra-ui/layout";



const Index = () => {


  return (
    <Layout>
      <Box>Github actions test: part 3</Box>
      <PlayerCards />
    </Layout>
  )
}

export default withApollo({ ssr: false })(Index);