import React, { useState } from 'react'
import { PlayerObject } from './providers/interfaces'
import { FFARoll } from "./providers/GroupRollLogic"

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
    </>
  )
}

export default FreeForAllRoll