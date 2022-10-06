import dynamic from "next/dynamic"
import React, { useLayoutEffect, useState } from "react"
import { useQueryClient } from "react-query"
import { client } from "../lib/clients/graphqlRequestClient"
import CardGeneric from "./CardGeneric"
import CardWrapper from "./CardWrapper"


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
  const [isLoading, setIsLoading] = useState(false)


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
      console.log('player input', playerInput)

    }
  }



  const updateField = async (field: string, changeValue: any) => {
    if (player) {
      setPlayer({ ...player, [field]: changeValue })
      console.log('field', field)
      console.log('changeValue', changeValue)
    }

  }


  return (
    <CardWrapper locked={player?.locked || false}>
      <CardGeneric
        hideDelete={editing}
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
        loading={isLoading}
        name={{
          value: name || "",
          onChange: (name: string) => {
            setName(name)
          },
          isLoading: isLoading
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
            console.log('delete with id', playerId)
          }
        }} />
    </CardWrapper>
  )
}



export default PlayerCard