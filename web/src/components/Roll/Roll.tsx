import React, { FC } from 'react'
import { CurrentRoll } from './CurrentRoll'
import { RemainingPlayers } from './RemainingPlayers'
import { useRollMutation, useRollQuery } from '../../utils/rollApi'
import { useCurrentGroupSlice } from '../../stores/CurrentGroup.slice'

export type RollsType = {

}

const Roll: FC<RollsType> = (): JSX.Element => {
  const groupId = useCurrentGroupSlice(state => state.id)
  const { isLoading } = useRollQuery(groupId)

  const rollMutation = useRollMutation(groupId)

  if (isLoading) {
    return (
      <div className='skeleton'></div>
    )
  }
  return (
    <div className='vStack'>
      <CurrentRoll />
      <RemainingPlayers />
      {/* <PreviousRolls /> */}
      <button onClick={async () => {
        await rollMutation.mutateAsync()
      }}>Roll</button>
    </div >
  )
}



export default Roll