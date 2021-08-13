import React from "react"
import PlayerCards from "../components/PlayerCards"
import { Layout } from "../components/Layout";
import { withApollo } from "../utils/withApollo";



const Index = () => {


  return (
    <Layout>
      <PlayerCards />
    </Layout>
  )
}

export default withApollo({ ssr: false })(Index);