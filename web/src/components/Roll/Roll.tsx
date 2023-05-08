import { VStack } from '@chakra-ui/layout'
import { Button, Skeleton } from '@chakra-ui/react'
import React, { FC } from 'react'
import { CurrentRoll } from './CurrentRoll'
import { RemainingPlayers } from './RemainingPlayers'
import { PreviousRolls } from './PreviousRolls'
import { useRollSlice } from '../../stores/Roll.slice'
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
      <>
        <Skeleton />
      </>
    )
  }
  return (
    <VStack>
      <CurrentRoll />
      <RemainingPlayers />
      {/* <PreviousRolls /> */}
      <Button variant="solid" onClick={async () => {
        await rollMutation.mutateAsync()
      }}>Roll</Button>
    </VStack >
  )
}



export default Roll