import { VStack } from '@chakra-ui/layout'
import { Button } from '@chakra-ui/react'
import React, { FC } from 'react'
import { CurrentRoll } from './CurrentRoll'
import { RemainingPlayers } from './RemainingPlayers'
import { PreviousRolls } from './PreviousRolls'

export type RollsType = {

}

const Roll: FC<RollsType> = (): JSX.Element => {

  return (
    <VStack>
      <CurrentRoll />
      <RemainingPlayers />
      <PreviousRolls />
      <Button variant="solid" onClick={() => { console.log('rollclick') }}>Roll</Button>
    </VStack >
  )
}



export default Roll