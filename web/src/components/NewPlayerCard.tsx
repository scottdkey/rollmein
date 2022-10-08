import { Button, Spinner } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { useQueryClient } from "react-query";
import CardWrapper from "./CardWrapper"
import CardGeneric from "./CardGeneric";



const NewPlayerCard = () => {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [tank, setTank] = useState(false)
  const [healer, setHealer] = useState(false)
  const [dps, setDps] = useState(false)
  const [inTheRoll, setInTheRoll] = useState(false)
  const [locked, setLocked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)


  const handleSubmit = () => {
    console.log('submit')
  }

  if (!open) {
    return (
      <CardWrapper locked={false}>
        <Button variant="teal" onClick={() => setOpen(true)}>New Player</Button>
      </CardWrapper>
    )
  } else if (isLoading) {
    return (
      <CardWrapper locked={false}>
        <Spinner />
      </CardWrapper>
    )
  } else {
    return (
      <CardWrapper locked={false}>
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
      </CardWrapper>
    )
  }
}

export default NewPlayerCard