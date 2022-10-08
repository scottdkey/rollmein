import { Box, Center, Heading, HStack } from "@chakra-ui/layout"
import { Input } from "@chakra-ui/react"
import React from "react"
import { Trash, Lock, OpenLock, Dice, Shield, Sword, FirstAid } from "../assets"
import { useColorModeValue } from "@chakra-ui/react"
import { IconWrapper } from "./IconWrapper"
import { CheckCircleIcon, EditIcon } from "@chakra-ui/icons"
import { useQuery } from "@apollo/client/react"
import { gql } from "@apollo/client"




export type CardGenericType = {
  locked: {
    selected: boolean,
    onClick: Function,
  },
  inTheRoll: {
    selected: boolean,
    onClick: Function,
  },
  editing: {
    state: boolean,
    onClick: Function
  },
  onSubmit: Function,
  loading: boolean,
  hideDelete: boolean,
  name: {
    value: string,
    onChange: Function,
    isLoading: boolean,
  },
  tank: {
    selected: boolean,
    onClick: Function
  },
  dps: {
    selected: boolean,
    onClick: Function
  },
  healer: {
    selected: boolean,
    onClick: Function
  },
  deleteObject: {
    show: boolean,
    onClick: Function
  }
}

const getOptions = gql`
query Options{
  options{
    lockAfterOut
    rollType
    theme
  }
}
`;

const CardGeneric = ({ locked, inTheRoll, editing, name, onSubmit, tank, dps, healer, deleteObject, hideDelete }: CardGenericType) => {
  const { loading, error, data } = useQuery(getOptions);
  const textColor = useColorModeValue("gray.700", "gray:200")
  return (
    <Box position="relative" onKeyPress={e => {
      if (e.key === "Enter") {
        onSubmit()
      }
    }}>
      <Box zIndex="10" position="absolute" right="-2" top="-2">
        {hideDelete ?
          <IconWrapper color="red" selected={true} Icon={Trash} onClick={() => deleteObject.onClick()} />
          : null}
      </Box>
      <Center padding="4" color={useColorModeValue("gray.100", "gray.200")}>
        {editing.state ?
          <Input
            h="20px"
            name="name"
            textAlign="center"
            fontSize="xl"
            textShadow="2xl"
            textColor={textColor}
            fontWeight="800"
            placeholder="player name"
            value={name.value}
            size="xsm"
            onChange={(e) => name.onChange(e.target.value)}
          >
          </Input>

          : <Heading
            h="20px"
            textColor={textColor}
            textShadow="2xl"
            fontSize="xl"
            textAlign="center"
            justifyContent="center"
            alignContent="center">{
              name.value}
          </Heading>}
      </Center>
      <HStack marginBottom="2" align="center" justify="center">
        <IconWrapper color="yellow" selected={locked.selected} Icon={locked.selected ? Lock : OpenLock} onClick={() => { locked.onClick() }} />
        <IconWrapper color="teal" selected={inTheRoll.selected} Icon={Dice} onClick={() => {
          inTheRoll.onClick()
        }} />
        <IconWrapper onClick={() => {
          if (editing.state) {
            onSubmit()
          } else {
            editing.onClick()

          }

        }} color={editing ? "green" : "gray"} selected={editing.state} Icon={editing.state ? CheckCircleIcon : EditIcon} />
      </HStack>

      {data?.options?.rollType === "role" ? <HStack align="center" justify="center">
        <IconWrapper selected={tank.selected} color="blue" Icon={Shield} onClick={() => tank.onClick()} />
        <IconWrapper selected={dps.selected} color="orange" Icon={Sword} onClick={() => dps.onClick()} />
        <IconWrapper selected={healer.selected} color="green" Icon={FirstAid} onClick={() => healer.onClick()} />
      </HStack> : null}

    </Box >
  )
}

export default CardGeneric