import { Box, Button, Center, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Spinner, useDisclosure, VStack, Wrap, WrapItem, } from "@chakra-ui/react"

import PlayerCount from "../PlayerCounts/PlayerCount";
import PlayerCard from "./PlayerCard"
import { NewPlayerCard } from "./NewPlayerCard";
import { useGetGroupPlayers } from "../../utils/player.api";
import { useCurrentGroupSlice } from "../../stores/CurrentGroup.slice";


const PlayerCards = ({ groupId }: { groupId: string }): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const rollType = useCurrentGroupSlice(state => state.rollType)

  const { isLoading, data: players } = useGetGroupPlayers({ groupId })

  if (isLoading) {
    return <Box><Spinner /></Box>
  }

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
        onClose={onClose}
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

                {players && players.map((player) => {
                  return (
                    <WrapItem key={player.id} >
                      <PlayerCard
                        id={player.id} rollType={rollType} profilePage={false} />
                    </WrapItem>
                  )
                })}
                <NewPlayerCard rollType={rollType} groupId={groupId} />
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



export default PlayerCards