import { Box, Button, Center, Heading, HStack, Input, Spinner } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { useQueryClient } from "react-query";
import { Trash, Lock, OpenLock, Dice, Sheild, Sword, FirstAid } from "../assets";
import { CreatePlayerMutation, CreatePlayerMutationVariables, useCreatePlayerMutation } from "../generated/graphql";
import { client } from "../lib/clients/graphqlRequestClient";
import CardGeneric, { CardWraper, IconWrapper } from "./CardGeneric";






const NewPlayerCard = () => {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [tank, setTank] = useState(false)
  const [healer, setHealer] = useState(false)
  const [dps, setDps] = useState(false)
  const [inTheRoll, setInTheRoll] = useState(false)
  const [locked, setLocked] = useState(false)
  const { mutate, isLoading } = useCreatePlayerMutation<CreatePlayerMutation, Error>(client, {
    onSuccess: (_data: CreatePlayerMutation, _variables: CreatePlayerMutationVariables, _context: unknown) => {
      queryClient.invalidateQueries(["Players"])
      queryClient.refetchQueries("Players")
      setOpen(false)
      setName("")
      setTank(false)
      setHealer(false)
      setDps(false)
      setInTheRoll(false)
      setLocked(false)
    }
  })

  const handleSubmit = () => {
    mutate({
      input: {
        name,
        tank,
        healer,
        dps,
        locked,
        inTheRoll
      }
    })
  }

  if (!open) {
    return (
      <CardWraper>
        <Button variant="teal" onClick={() => setOpen(true)}>New Player</Button>
      </CardWraper>
    )
  } else if (isLoading) {
    return (
      <CardWraper>
        <Spinner />
      </CardWraper>
    )
  } else {
    return (
      <CardWraper>
        <Box position="absolute" top="2" right="0">
          <IconWrapper color="red" selected={true} Icon={Trash} onClick={() => { }} />
        </Box>
        <Box position="absolute" top="2" left="2">
          <IconWrapper color="yellow" selected={locked} Icon={locked ? Lock : OpenLock} onClick={() => setLocked(!locked)} />
        </Box>
        <Box position="absolute" top="2" left="50">
          <IconWrapper color="teal" selected={inTheRoll} Icon={Dice} onClick={() => setInTheRoll(!inTheRoll)} />
        </Box>

        <HStack mt="6" alignContent="center" justifyContent="center">
          <Input
            color="gray.700"
            name="name"
            placeholder="player name"
            label="name"
            value={name}
            size="sm"
            onChange={(e) => {
              e.preventDefault()
              setName(e.target.value)
            }}
          >
          </Input>
          <Button
            mt={4}
            type="submit"
            isLoading={isLoading}
            color="green.700"
            bgColor="green.300"
            onClick={() => handleSubmit()}>
            submit
          </Button>
        </HStack>
        <Center mt="2">
          <HStack>
            <IconWrapper selected={tank} color="blue" Icon={Sheild} onClick={() => setTank(!tank)} />
            <IconWrapper selected={dps} color="orange" Icon={Sword} onClick={() => setDps(!dps)} />
            <IconWrapper selected={healer} color="green" Icon={FirstAid} onClick={() => setHealer(!healer)} />
          </HStack>
        </Center>
      </CardWraper>
    )
  }
}

export default NewPlayerCard