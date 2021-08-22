import { Box, Button, Circle, HStack, Icon, Input, Spinner } from "@chakra-ui/react";
import React, { FC, useState } from "react";
import { useQueryClient } from "react-query";
import { Dice, FirstAid, Lock, OpenLock, Sheild, Sword } from "../assets";
import { CreatePlayerMutation, CreatePlayerMutationVariables, useCreatePlayerMutation } from "../generated/graphql";
import { client } from "../lib/clients/graphqlRequestClient";



interface IconWrapperType {
  Icon: typeof Icon
  onClick: Function
  selected: boolean
  color?: string
}
export const IconWrapper: FC<IconWrapperType> = ({ Icon, onClick, selected, color = "teal" }): JSX.Element => {
  return (
    <Circle bg={selected ? `${color}.300` : "gray.400"} w="10" h="10" _hover={{
      backgroundColor: selected ? `${color}.400` : "gray.300"
    }

    } onClick={() => {
      onClick()
    }}>
      <Icon w={8} h={8} color={selected ? `${color}.600` : "gray.500"} _hover={{
        color: selected ? `${color}.700` : "gray.600"
      }} />
    </Circle >
  )
}


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

  if (open && !isLoading) {
    return (
      <Box p={5} w="250px" h="150px" shadow="md" borderWidth="1px" bg="blue.200" position="relative">
        <Box position="absolute" top="2" left="2"><IconWrapper color="yellow" selected={locked} Icon={locked ? Lock : OpenLock} onClick={() => {
          setLocked(!locked)
        }} /></Box>
        <Box position="absolute" top="2" left="50"><IconWrapper selected={inTheRoll} Icon={Dice} onClick={() =>
          setInTheRoll(!inTheRoll)
        } /></Box>

        <HStack mt="8">
          <Input
            color="gray.700"
            name="name"
            placeholder="player name"
            label="name"
            value={name || ""}

            onChange={(e) => {
              setName(e.target.value)
            }}
          />
          <Button
            mt={4}
            type="submit"
            isLoading={isLoading}
            colorScheme="teal"
            onClick={() => {
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
            }}
          >
            submit
          </Button>
        </HStack>




        <HStack justifyContent="center">
          <IconWrapper selected={tank} Icon={Sheild} onClick={() => {
            setTank(!tank)
          }} />
          <IconWrapper selected={dps} Icon={Sword} onClick={() => {
            setDps(!dps)
          }} />
          <IconWrapper selected={healer} Icon={FirstAid} onClick={() => {
            setHealer(!healer)
          }} />
        </HStack>



      </Box >
    )

  } else if (isLoading) {
    return (
      <Box p={5} w="250px" shadow="md" borderWidth="1px" bg="blue.200">
        <Spinner />
      </Box>
    )
  } else {
    return (
      <Box p={5} w="250px" h="150px" shadow="md" borderWidth="1px" bg="blue.200" position="relative">
        <Button variant="teal" onClick={() => setOpen(true)}>New Player</Button>
      </Box>
    )
  }

}

export default NewPlayerCard