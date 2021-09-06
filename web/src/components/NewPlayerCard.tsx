import { Box, Button, Center, Heading, HStack, Input, Spinner } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { useQueryClient } from "react-query";
import { Trash, Lock, OpenLock, Dice, Sheild, Sword, FirstAid } from "../assets";
import { CreatePlayerMutation, CreatePlayerMutationVariables, useCreatePlayerMutation } from "../generated/graphql";
import { client } from "../lib/clients/graphqlRequestClient";
import CardGeneric, { CardWraper } from "./CardGeneric";
import { IconWrapper } from "./IconWrapper";






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
      <CardWraper locked={false}>
        <Button variant="teal" onClick={() => setOpen(true)}>New Player</Button>
      </CardWraper>
    )
  } else if (isLoading) {
    return (
      <CardWraper locked={false}>
        <Spinner />
      </CardWraper>
    )
  } else {
    return (
      <CardWraper locked={false}>
        <CardGeneric
          hideDelete={true}
          locked={{
            selected: locked,
            onClick: () => setLocked(!locked)
          }} inTheRoll={{
            selected: inTheRoll,
            onClick: () => setInTheRoll(!inTheRoll)
          }} editing={{
            state: true,
            onClick: () => { }
          }} onSubmit={() => handleSubmit()} loading={isLoading}
          name={{
            value: name,
            onChange: (name: string) => setName(name),
            isLoading: isLoading
          }} tank={{
            selected: tank,
            onClick: () => setTank(!tank)
          }} dps={{
            selected: dps,
            onClick: () => setDps(!dps)
          }} healer={{
            selected: healer,
            onClick: () => setHealer(!healer)
          }} deleteObject={{
            show: false,
            onClick: () => { }
          }} />

      </CardWraper>
    )
  }
}

export default NewPlayerCard