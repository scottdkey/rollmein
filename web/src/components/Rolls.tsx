import { Box, Center, Heading, VStack } from '@chakra-ui/layout'
import { HStack, Button, Input, useNumberInput, useToast } from '@chakra-ui/react'
import React, { FC, useState } from 'react'
import { PlayersQuery, usePlayersQuery } from '../generated/graphql'
import { client } from '../lib/clients/graphqlRequestClient'
import { FFARoll, getInGroup, numberInTheRoll, Player } from '../utils/rollHelpers'

export type RollsType = {

}

const Rolls: FC<RollsType> = (): JSX.Element => {
  const { data, isLoading } = usePlayersQuery<PlayersQuery, Error>(client);
  const [rollSize, SetRollSize] = useState(5)
  const [currentRoll, setCurrentRoll] = useState<Player[] | undefined>()
  const [remainingPlayers, setRemainingPlayers] = useState<Player[] | undefined>()
  const [previousRoll, setPreviousRoll] = useState<Player[] | undefined>()
  const [validRole, setValidRole] = useState(false)
  const toast = useToast()


  const rollClick = () => {

    const inCount = data?.players ? numberInTheRoll(data.players) : 0
    const playerText = inCount === 1 ? "player is" : "players are"
    if (inCount < rollSize) {
      toast({
        title: "size mismatch",
        description: `Only ${inCount} ${playerText} in the roll. Your roll size is ${rollSize}. Include more players in your roll`,
        status: "error",
        duration: 5000,
        isClosable: true
      })

    } else if (inCount === rollSize) {
      toast({
        title: "equal numbers",
        description: `you have the same amount in your rollsize and available players. No roll required`,
        status: "error",
        duration: 5000,
        isClosable: true
      })
    } else {
      if (data?.players) {
        const currentPlayers = getInGroup(data?.players)
        const roll = FFARoll(currentPlayers, rollSize)
        setCurrentRoll(roll.players)
        setRemainingPlayers(roll.remaining)
      } else {
        toast({
          title: "server error",
          description: `unknown server error occurred`,
          status: "error",
          duration: 5000,
          isClosable: true
        })
      }
    }
  }



  const incrament = () => {
    const inCount = data?.players ? numberInTheRoll(data.players) : 0
    if (rollSize >= 25) {
      toast({
        title: "too many players",
        description: "You must have less than 25 players in a roll",
        status: "error",
        duration: 5000,
        isClosable: true
      })
    }

    else {
      SetRollSize(rollSize + 1)
    }

  }
  const decrement = () => {
    const inCount = data?.players ? numberInTheRoll(data.players) : 0
    if (rollSize <= 1) {
      toast({
        title: "too few players",
        description: "You must have at least 1 player in a roll",
        status: "error",
        duration: 5000,
        isClosable: true
      })
    } else {
      SetRollSize(rollSize - 1)
    }

  }

  type RollInfoType = {
    players: Player[] | undefined
  }

  const RollInfo: FC<RollInfoType> = ({ players }) => {
    if (players === undefined) {
      return null
    } else {
      return (
        <HStack>
          {
            players.map(player => {
              return (<Box key={player.id}>
                {player.name}
              </Box>)
            })
          }
        </HStack>
      )
    }

  }
  return (
    <VStack>
      <Center textAlign="center">
        RollSize
      </Center>
      <HStack maxW="320px">
        <Button onClick={incrament}>+</Button>
        <Box>{rollSize}</Box>
        <Button onClick={decrement}>-</Button>
      </HStack>
      {currentRoll ? <Heading size="large">In the roll</Heading> : null}
      <RollInfo players={currentRoll} />
      {remainingPlayers ? <Heading size="large">Out of the Roll</Heading> : null}
      <RollInfo players={remainingPlayers} />
      <Button onClick={rollClick
      }>Roll</Button>
    </VStack>
  )
}


export default Rolls