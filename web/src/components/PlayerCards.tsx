import { Box, Button, Center, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, HStack, Spinner, useDisclosure, VStack, Wrap, WrapItem, } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"

import PlayerCount from "./PlayerCount";
import PlayerCard from "./PlayerCard"
import { useQueryClient } from "react-query";
import { RollType } from "../types/Group.enum";


interface PlayerCardsProps {
  rollType: RollType,
  groupId: string
}

const PlayerCards = (props: PlayerCardsProps): JSX.Element => {
  const queryClient = useQueryClient()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [players, setPlayers] = useState<string[] | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState({})



  if (isLoading) {
    return <Box><Spinner /></Box>
  } else if (!isLoading && !data) {
    return (<Box bg="red">Query Failed<Button onClick={() => {
      queryClient.refetchQueries("Players")
    }}>Retry</Button></Box>)
  } else {
    return (
      <>
        <Button onClick={onOpen} zIndex="0" padding="40px"
          variant="solid" _focus={{
            outline: "none"
          }}
        >
          <PlayerCount rollType={props.rollType} />
        </Button>
        <Drawer
          isOpen={isOpen}
          placement="top"
          onClose={() => {
            onClose()
            queryClient.invalidateQueries("Players")
          }}
          size="xl"
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Players</DrawerHeader>
            <DrawerBody>
              <VStack>
                <Button onClick={onClose} zIndex="0" padding="40px"
                  variant="solid" _focus={{
                    outline: "none"
                  }}
                >
                  <PlayerCount rollType={props.rollType} />
                </Button>

                <Wrap spacing="5px" align="center" m="5px" justify="center">

                  {players?.map((player) =>
                    <WrapItem key={player} >
                      <PlayerCard id={player} rollType={props.rollType} profilePage={false} />
                    </WrapItem>)}
                  <NewPlayerCard rollType={props.rollType} groupId={props.groupId} />
                  <WrapItem>
                  </WrapItem>
                </Wrap>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    )
  }

}

const NewPlayerCard = (props: { rollType: RollType, groupId: string }) => {

  const [addPlayer, setAddPlayer] = useState(false)
  return (
    <>
      {addPlayer ?
        <PlayerCard rollType={props.rollType} profilePage={false} closeCreate={() => setAddPlayer(false)} groupId={props.groupId}/> :

        <Box borderRadius={"md"} padding={2} w="240px" h="180px" shadow="base" borderWidth="10px" position="relative" justifyContent="center" alignItems="center">
          <Center>  <Button m='auto' onClick={() => { setAddPlayer(true) }}>Add a player</Button></Center>
        </Box>}

    </>
  )
}

export default PlayerCards