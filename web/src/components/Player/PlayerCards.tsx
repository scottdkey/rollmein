import { Box, Button, Center, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Spinner, useDisclosure, VStack, Wrap, WrapItem, } from "@chakra-ui/react"

import PlayerCount from "./PlayerCount";
import PlayerCard from "./PlayerCard"
import { useQueryClient } from "react-query";
import { useGroupSlice } from "../../stores/Group.slice";
import { NewPlayerCard } from "./NewPlayerCard";

import { usePlayersSlice } from "../../stores/Players.slice";
import { useSession } from "next-auth/react";
import { useGetGroupPlayers } from "../../utils/player.api";


const PlayerCards = ({ groupId }: { groupId: string }): JSX.Element => {
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const groups = useGroupSlice(state => state.groups)
  const group = groups.find(group => group.id === groupId)
  const players = usePlayersSlice(state => state.players)
  const setPlayers = usePlayersSlice(state => state.setPlayers)

  const { isLoading } = useGetGroupPlayers({
    onSuccess: (players) => {
      setPlayers(players)
    },
    groupId,
    sessionToken: session?.id
  })




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
          <PlayerCount groupId={group.id} />
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
                  <PlayerCount groupId={group.id} />
                </Button>
              </Center>
            </DrawerHeader>
            <DrawerBody>
              <VStack>


                <Wrap spacing="5px" align="center" m="5px" justify="center">

                  {players.map((player) =>
                    <WrapItem key={player.id} >
                      <PlayerCard
                        id={player.id} rollType={group.rollType} profilePage={false} />
                    </WrapItem>)}
                  <NewPlayerCard rollType={group.rollType} groupId={group.id} />
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



export default PlayerCards