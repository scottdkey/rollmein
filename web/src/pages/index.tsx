import React from "react"
import { Groups } from "../components/Groups";
import { getSession } from "next-auth/react";
import { Layout } from "../components/Layout";
import { Session } from "next-auth";


const Index = () => {
  return (
    <>
      <Groups />
    </>
  )
}

export default Index;