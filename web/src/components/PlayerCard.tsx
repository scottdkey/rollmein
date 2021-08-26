import { Box, Button, Center, Heading, HStack, Input, Spinner, Text, WrapItem } from "@chakra-ui/react"

import React, { useEffect, useState } from "react"
import { useQueryClient } from "react-query"
import { Dice, FirstAid, Lock, OpenLock, Sheild, Sword, Trash } from "../assets"
import { DeletePlayerMutation, UpdatePlayerMutation, UpdatePlayerMutationVariables, useDeletePlayerMutation, usePlayerQuery, useUpdatePlayerMutation } from "../generated/graphql"
import { client } from "../lib/clients/graphqlRequestClient"
import CardGeneric, { CardWraper, IconWrapper } from "./CardGeneric"


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
  playerId: number,
  deletePlayer: Function
}
const PlayerCard = ({ playerId, deletePlayer }: PlayerCardProps): JSX.Element => {
  const queryClient = useQueryClient()
  const [player, setPlayer] = useState<Player>()
  const [name, setName] = useState(player?.name)
  const [editing, setEditing] = useState(false)
  const UpdatePlayerMutation = useUpdatePlayerMutation<UpdatePlayerMutation | Error>(client, {
    onSuccess: (data: UpdatePlayerMutation, _variables: UpdatePlayerMutationVariables, _context: unknown) => {
      queryClient.invalidateQueries(["Player", {
        id: playerId
      }])
    }
  })
  const deletePlayerMutation = useDeletePlayerMutation<DeletePlayerMutation | Error>(client, {
    onSuccess: () => {
      deletePlayer(playerId)
      queryClient.invalidateQueries("Players")
    }
  })
  const { data, isLoading } = usePlayerQuery(client, {
    id: playerId
  })

  const handleSubmit = async () => {
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
      await UpdatePlayerMutation.mutateAsync({
        input: playerInput
      }).then(res => {
        if (res.updatePlayer) {
          setPlayer({ ...res.updatePlayer })
        }
        setEditing(false)
      })

    }
  }


  useEffect(() => {
    if (!isLoading && data?.player) {
      setPlayer(data.player)
      setName(data.player.name)
    }
  }, [data, isLoading])


  const updateField = async (field: string, changeValue: any) => {
    if (player) {
      setPlayer({ ...player, [field]: changeValue })
      await UpdatePlayerMutation.mutateAsync({
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


  if (isLoading) {
    return (
      <CardWraper>
        <Spinner />
      </CardWraper>

    )
  } else {
    return (
      <CardWraper>
        <CardGeneric
          locked={{
            selected: player?.locked || false,
            onClick: () => { updateField("locked", !player?.locked) }
          }}
          inTheRoll={{
            selected: player?.inTheRoll || false,
            onClick: () => {
              updateField("inTheRoll", !player?.inTheRoll)
            }
          }}
          editing={{
            state: editing,
            onClick: () => {
              setEditing(!editing)
            }
          }}
          onSubmit={() => handleSubmit()}
          loading={UpdatePlayerMutation.isLoading}
          name={{
            value: name || "",
            onChange: (name: string) => {
              setName(name)
            },
            isLoading: UpdatePlayerMutation.isLoading
          }}
          tank={{
            selected: player?.tank || false,
            onClick: () => updateField("tank", !player?.tank)
          }}
          dps={{
            selected: player?.dps || false,
            onClick: () => updateField("dps", !player?.dps)
          }}
          healer={{
            selected: player?.healer || false,
            onClick: () => updateField("healer", !player?.healer)
          }} deleteObject={{
            show: true,
            onClick: () => {
              deletePlayerMutation.mutate({ id: playerId })
            }
          }} />
      </CardWraper>
    )
  }
}


export default PlayerCard