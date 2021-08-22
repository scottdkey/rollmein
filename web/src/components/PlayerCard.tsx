import { Box, Button, Center, Heading, HStack, Input, Spinner, Text, WrapItem } from "@chakra-ui/react"

import React, { useEffect, useState } from "react"
import { useQueryClient } from "react-query"
import { Dice, FirstAid, Lock, OpenLock, Sheild, Sword, Trash } from "../assets"
import { UpdatePlayerMutation, UpdatePlayerMutationVariables, usePlayerQuery, useUpdatePlayerMutation } from "../generated/graphql"
import { client } from "../lib/clients/graphqlRequestClient"
import { IconWrapper } from "./NewPlayerCard"


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
  const [player, setPlayer] = useState<Player>()
  const [name, setName] = useState(player?.name)
  const [editing, setEditing] = useState(false)
  const { mutateAsync, mutate } = useUpdatePlayerMutation<UpdatePlayerMutation | Error>(client, {
    onSuccess: (data: UpdatePlayerMutation, _variables: UpdatePlayerMutationVariables, _context: unknown) => {
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
      setPlayer(data.player)
      setName(data.player.name)
    }
  }, [data])


  const updateField = async (field: string, changeValue: any) => {
    if (player) {
      setPlayer({ ...player, [field]: changeValue })
      await mutateAsync({
        input: {
          ...player,
          [field]: changeValue

        }
      }).then(({ updatePlayer }) => {
        if (updatePlayer) {
          setPlayer({ ...updatePlayer })
        }

      })
    }

  }


  if (isLoading && !data?.player) {
    return (
      <Box p={5} w="250px" h="150px" shadow="md" borderWidth="1px" bg="blue.200">
        <Spinner />
      </Box>

    )
  } else {
    return (
      <Box p={5} w="250px" h="150px" shadow="md" borderWidth="1px" bg="blue.200" position="relative" justifyContent="center" alignItems="center">
        <Box position="absolute" top="2" right="0"><IconWrapper color="red" selected={true} Icon={Trash} onClick={() => { }} /></Box>
        <Box position="absolute" top="2" left="2"><IconWrapper color="yellow" selected={player?.locked!} Icon={player?.locked ? Lock : OpenLock} onClick={() => {
          updateField("locked", !player?.locked)
        }} /></Box>
        <Box position="absolute" top="2" left="50"><IconWrapper color="teal" selected={player?.inTheRoll!} Icon={Dice} onClick={() => {
          updateField("inTheRoll", !player?.inTheRoll)
        }} /></Box>

        <HStack mt="6" alignContent="center" justifyContent="center">
          {editing ?
            <Input
              color="gray.700"
              name="name"
              placeholder="player name"
              label="name"
              value={name || ""}
              size="sm"
              onChange={(e) => {
                setName(e.target.value)

              }}
            >
            </Input>

            : <Heading
              fontSize="xl"
              textAlign="center"
              justifyContent="center"
              alignContent="center">{
                name}
            </Heading>}
          {editing ? <Button
            mt={4}
            type="submit"
            isLoading={isLoading}
            color="green.700"
            bgColor="green.300"
            onClick={async () => {
              if (player && name) {
                const playerInput = {
                  id: player?.id,
                  tank: player?.tank,
                  dps: player?.dps,
                  healer: player?.healer,
                  locked: player?.locked,
                  inTheRoll: player?.inTheRoll,
                  name
                }
                await mutateAsync({
                  input: playerInput
                }).then(res => {
                  if (res.updatePlayer) {
                    setPlayer({ ...res.updatePlayer })
                  }
                  setEditing(!editing)


                })

              }


            }

            }

          >
            submit
          </Button> : <Button ml="auth" color="green.700"
            bgColor="green.300" onClick={() => {
              setName(player?.name)
              setEditing(!editing)

            }}>Edit</Button>}
        </HStack>





        <Center mt="2">
          <HStack>
            <IconWrapper selected={player?.tank!} color="blue" Icon={Sheild} onClick={() => {
              updateField("tank", !player?.tank)
            }} />
            <IconWrapper selected={player?.dps!} color="orange" Icon={Sword} onClick={() => {
              updateField("dps", !player?.dps)
            }} />
            <IconWrapper selected={player?.healer!} color="green" Icon={FirstAid} onClick={() => {
              updateField("healer", !player?.healer)
            }} />
          </HStack>
        </Center>
      </Box >

    )
  }
}


export default PlayerCard