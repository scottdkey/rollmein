import { Box } from '@chakra-ui/layout'
import { HStack, Button, Input, useNumberInput, useToast } from '@chakra-ui/react'
import React, { FC, useState } from 'react'

export type RollsType = {

}

const Rolls: FC<RollsType> = (): JSX.Element => {
  const [rollSize, SetRollSize] = useState(5)
  const toast = useToast()
  const incrament = () => {
    if (rollSize >= 25) {
      toast({
        title: "too many players",
        description: "You must have less than 25 players in a roll",
        status: "error",
        duration: 5000,
        isClosable: true
      })
    } else {
      SetRollSize(rollSize + 1)
    }

  }
  const decrement = () => {
    if (rollSize <= 3) {
      toast({
        title: "too few players",
        description: "You must have at least 3 players in a roll",
        status: "error",
        duration: 5000,
        isClosable: true
      })
    } else {
      SetRollSize(rollSize - 1)
    }

  }
  return (
    <Box>
      RollSize
      <HStack maxW="320px">
        <Button onClick={incrament}>+</Button>
        <Box>{rollSize}</Box>
        <Button onClick={decrement}>-</Button>
      </HStack>
    </Box>
  )
}


export default Rolls