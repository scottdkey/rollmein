import { Box, Heading, HStack, Text } from "@chakra-ui/react"
import React, { useState } from "react"
import { useUpdatePlayerMutation } from "../generated/graphql"


export type Player = {
  name: string,
  tank: boolean,
  healer: boolean,
  dps: boolean,
  locked: boolean,
  inTheRoll: boolean
  id: string
}
export const PlayerCard = ({ player }: { player: Player }) => {
  const [p, setP] = useState(player)
  const [updatePost] = useUpdatePlayerMutation()
  return (
    <Box p={5} w="250px" shadow="md" boderWidth="1px" key={p.id} bg="blue.200">
      <Heading fontSize="xl">{p.name}</Heading>
      <HStack>
        <Text mt={4}>in the roll: {p.inTheRoll.toString()}</Text>
        <Text>locked: {p.locked.toString()}</Text>
      </HStack>
      <HStack>
        <Text>dps: {p.dps.toString()}</Text>
        <Text>tank: {p.tank.toString()}</Text>
        <Text>healer: {p.healer.toString()}</Text>
      </HStack>
    </Box>
  )
}