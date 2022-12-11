import { Spinner, Text, VStack } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useAuth } from "../providers/AuthProvider"
import { IGroup, useGroupsQuery } from "../utils/groupApi"
import { GroupForm } from "./GroupForm"

export const Group = ({ group }: { group: IGroup }) => {
  return (
    <>
      {JSON.stringify(group)}
    </>
  )
}


export const Groups = () => {
  const { auth } = useAuth()
  const { data, isLoading } = useGroupsQuery()

  if (data) {
    return (
      <VStack>
        <GroupForm />
        {data.length > 0 ? data.map(group => <Group group={group} />) : <Text>No Group data found</Text>}
      </VStack>
    )
  }
  if (isLoading) {
    <Spinner />
  }
  return (
    <VStack>
      <GroupForm />
      <Text>
        No Group data found
      </Text>

    </VStack>
  )
}

