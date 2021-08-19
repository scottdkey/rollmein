import { Box, Heading, HStack, Text, WrapItem } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { useQueryClient } from "react-query"
import { UpdatePlayerMutation, UpdatePlayerMutationVariables, usePlayerQuery, useUpdatePlayerMutation } from "../generated/graphql"
import { client } from "../lib/clients/graphqlRequestClient"


export type Player = {
  id: number,
  name: string,
  tank: boolean,
  healer: boolean,
  dps: boolean,
  locked: boolean,
  inTheRoll: boolean
}

interface PlayerCardProps {
  playerId: number
}
const PlayerCard = ({ playerId }: PlayerCardProps): JSX.Element => {
  const queryClient = useQueryClient()
  const [player, setPlayer] = useState<Player>({
    id: 0,
    name: "error",
    tank: false,
    dps: false,
    healer: false,
    inTheRoll: false,
    locked: false
  })
  const { mutateAsync } = useUpdatePlayerMutation<UpdatePlayerMutation | Error>(client, {
    onSuccess: (data: UpdatePlayerMutation, _variables: UpdatePlayerMutationVariables, _context: unknown) => {
      queryClient.invalidateQueries(["Players", { id: playerId }])
      queryClient.invalidateQueries(["Player", {
        id: playerId
      }])
    }
  })
  const { data, isLoading } = usePlayerQuery(client, {
    id: playerId
  })
  useEffect(() => {
    if (!isLoading && data?.player) {
      setPlayer({ ...data.player })
    }
  }, [data, isLoading, setPlayer])

  const playerInput = {
    name: player.name,
    tank: player.tank,
    healer: player.healer,
    dps: player.dps,
    inTheRoll: player.inTheRoll,
    locked: player.locked
  }
  if (player.id === 0) {
    return (
      <>
      </>
    )
  }
  const updateField = async (field: string, changeValue: any) => {
    if (player) {
      await mutateAsync({
        id: playerId,
        input: {
          ...playerInput,
          [field]: changeValue

        }
      }).then(({ updatePlayer }) => {
        if (updatePlayer) {
          setPlayer({ ...updatePlayer })
        }

      })
    }

  }
  return (
    <Box p={5} w="250px" shadow="md" borderWidth="1px" bg="blue.200">
      <Heading fontSize="xl">{player?.name}</Heading>
      <HStack>
        <Text onClick={() => {
          updateField("inTheRoll", !player.inTheRoll)
        }} mt={4}>in the roll: {player?.inTheRoll}</Text>
        <Text onClick={() => {
          updateField("locked", !player.locked)
        }}>locked: {player?.locked.toString()}</Text>
      </HStack>
      <HStack>
        <Text onClick={() => {
          updateField("dps", !player.dps)
        }}>dps: {player?.dps.toString()}</Text>
        <Text onClick={() => {
          updateField("tank", !player.tank)
        }}>tank: {player?.tank.toString()}</Text>
        <Text onClick={() => {
          updateField("healer", !player.healer)
        }}>healer: {player?.healer.toString()}</Text>
      </HStack>
    </Box>

  )
}


export default PlayerCard