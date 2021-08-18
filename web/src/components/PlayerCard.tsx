import { Box, Heading, HStack, Text } from "@chakra-ui/react"
import React, { useState } from "react"
import { useQueryClient } from "react-query"
import { UpdatePlayerMutation, UpdatePlayerMutationVariables, useUpdatePlayerMutation } from "../generated/graphql"
import { client } from "../lib/clients/graphqlRequestClient"


export type Player = {
  name: string,
  tank: boolean,
  healer: boolean,
  dps: boolean,
  locked: boolean,
  inTheRoll: boolean
  id: number
}
const PlayerCard = ({ player }: { player: Player }) => {
  const queryClient = useQueryClient()
  const [playerState, setPlayerState] = useState<Player>(player)
  const { mutate } = useUpdatePlayerMutation<UpdatePlayerMutation | Error>(client, {
    onSuccess: (data: UpdatePlayerMutation, _variables: UpdatePlayerMutationVariables, _context: unknown) => {
      queryClient.invalidateQueries("GetAllPlayers")
      setPlayerState({ ...data.updatePlayer! })
    }
  })



  return (
    <Box p={5} w="250px" shadow="md" borderWidth="1px" bg="blue.200">
      <Heading fontSize="xl">{playerState.name}</Heading>
      <HStack>
        <Text mt={4}>in the roll: {playerState}</Text>
        <Text onClick={() => {
          mutate({
            id: playerState.id,
            input: {
              ...playerState,

            }
          })
        }}>locked: {playerState.locked.toString()}</Text>
      </HStack>
      <HStack>
        <Text>dps: {playerState.dps.toString()}</Text>
        <Text>tank: {playerState.tank.toString()}</Text>
        <Text>healer: {playerState.healer.toString()}</Text>
      </HStack>
    </Box>
  )
}


export default PlayerCard