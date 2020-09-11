import React, { useState } from 'react'
import { PlayerObject } from './providers/interfaces'
import { FFARoll } from "./providers/GroupRollLogic"
import RenderGroup from './RenderGroup'

type FreeForAllRollType = {
  valid: boolean,
  rollGroup: Array<PlayerObject>
}

const FreeForAllRoll = ({ valid, rollGroup }: FreeForAllRollType) => {
  const [players, setPlayers] = useState<Array<PlayerObject>>()
  const [outGroup, setOutGroup] = useState<Array<PlayerObject>>()

  const rollForGroup = async () => {
    const res = await (FFARoll(rollGroup))
    setPlayers(res.players)
    setOutGroup(res.remaining)
  }

  return (
    <>
      <button disabled={valid === true} onClick={rollForGroup}>
        Roll!
    </button>
      <RenderGroup players={players!} header={"Group"} />
      <RenderGroup players={outGroup!} header={"Not in Roll"} />
    </>
  )
}

export default FreeForAllRoll