import { Box, Center, Circle, Heading, HStack } from "@chakra-ui/layout"
import { Button, Input, Icon } from "@chakra-ui/react"
import React from "react"
import { Trash, Lock, OpenLock, Dice, Sheild, Sword, FirstAid } from "../assets"


interface IconWrapperType {
  Icon: typeof Icon
  onClick: Function
  selected: boolean
  color?: string
}

export const CardWraper: React.FC = (props): JSX.Element => {
  return (
    <Box p={5} w="250px" h="150px" shadow="md" borderWidth="1px" bg="blue.200" position="relative" justifyContent="center" alignItems="center">{props.children}</Box>
  )
}

export const IconWrapper: React.FC<IconWrapperType> = ({ Icon, onClick, selected, color = "teal" }): JSX.Element => {
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

const CardGeneric = ({ locked, inTheRoll, editing, name, onSubmit, tank, dps, healer, deleteObject }: CardGenericType) => {

  return (
    <>
      {deleteObject.show ? <Box position="absolute" top="2" right="0">
        <IconWrapper color="red" selected={true} Icon={Trash} onClick={() => deleteObject.onClick()} />
      </Box> : null}
      <Box position="absolute" top="2" left="2">
        <IconWrapper color="yellow" selected={locked.selected} Icon={locked.selected ? Lock : OpenLock} onClick={() => { locked.onClick() }} />
      </Box>
      <Box position="absolute" top="2" left="50">
        <IconWrapper color="teal" selected={inTheRoll.selected} Icon={Dice} onClick={() => {
          inTheRoll.onClick()
        }} />
      </Box>

      <HStack mt="6" alignContent="center" justifyContent="center">
        {editing.state ?
          <Input
            color="gray.700"
            name="name"
            placeholder="player name"
            label="name"
            value={name.value}
            size="sm"
            onChange={(e) => name.onChange(e.target.value)}
          >
          </Input>

          : <Heading
            fontSize="xl"
            textAlign="center"
            justifyContent="center"
            alignContent="center">{
              name.value}
          </Heading>}
        {editing.state ? <Button
          mt={4}
          type="submit"
          isLoading={name.isLoading}
          color="green.700"
          bgColor="green.300"
          onClick={(e) => {
            e.preventDefault()
            onSubmit()
          }

          }

        >
          submit
        </Button> : <Button ml="auth" color="green.700"
          bgColor="green.300" onClick={() => {
            editing.onClick()
          }}>Edit</Button>}
      </HStack>
      <Center mt="2">
        <HStack>
          <IconWrapper selected={tank.selected} color="blue" Icon={Sheild} onClick={() => tank.onClick()} />
          <IconWrapper selected={dps.selected} color="orange" Icon={Sword} onClick={() => dps.onClick()} />
          <IconWrapper selected={healer.selected} color="green" Icon={FirstAid} onClick={() => healer.onClick()} />
        </HStack>
      </Center>
    </ >
  )
}

export default CardGeneric