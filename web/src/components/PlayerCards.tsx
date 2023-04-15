import { Box, Button, Center, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Spinner, useDisclosure, VStack, Wrap, WrapItem, } from "@chakra-ui/react"
import { useState } from "react"

import PlayerCount from "./PlayerCount";
import PlayerCard from "./PlayerCard"
import { useQueryClient } from "react-query";
import { RollType } from "../types/Group.enum";
import { useGroupQuery } from "../utils/groupApi";
import useGroupWs from "../providers/GroupWebsocketProvider";


const PlayerCards = (): JSX.Element => {
  const queryClient = useQueryClient()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { groupId } = useGroupWs()
  const { isLoading, data: group } = useGroupQuery(groupId, true)



  if (isLoading) {
    return <Box><Spinner /></Box>
  }
  if (group) {
    return (
      <>
        <Button onClick={onOpen} zIndex="0" padding="40px"
          variant="solid" _focus={{
            outline: "none"
          }}
        >
          <PlayerCount />
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
            <DrawerHeader>
              <Center>
                <Button onClick={onClose} zIndex="0" padding="40px"
                  variant="solid" _focus={{
                    outline: "none"
                  }}
                >
                  <PlayerCount />
                </Button>
              </Center>
            </DrawerHeader>
            <DrawerBody>
              <VStack>


                <Wrap spacing="5px" align="center" m="5px" justify="center">

                  {group.relations.players.map((player) =>
                    <WrapItem key={player} >
                      <PlayerCard
                        id={player} rollType={group.rollType} profilePage={false} />
                    </WrapItem>)}
                  <NewPlayerCard rollType={group.rollType} groupId={groupId} />
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

  return (<> error </>)
}

const NewPlayerCard = (props: { rollType: RollType, groupId: string }) => {

  const [addPlayer, setAddPlayer] = useState(false)
  return (
    <>
      {addPlayer ?
        <PlayerCard rollType={props.rollType} profilePage={false} closeCreate={() => setAddPlayer(false)} groupId={props.groupId} /> :

        <Box borderRadius={"md"} padding={2} w="240px" h="180px" shadow="base" borderWidth="10px" position="relative" justifyContent="center" alignItems="center">
          <Center>  <Button m='auto' onClick={() => { setAddPlayer(true) }}>Add a player</Button></Center>
        </Box>}

    </>
  )
}

export default PlayerCards