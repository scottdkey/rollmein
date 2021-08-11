import React from "react"
import PlayerCards from "../components/PlayerCards"
import { Layout } from "../components/Layout";
import { createUrqlClient } from "../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";



const Index = () => {


  return (
    <Layout>
      <PlayerCards pageProps />
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: false })(Index);