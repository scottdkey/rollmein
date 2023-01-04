import { Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Spinner, useDisclosure, Wrap, WrapItem, } from "@chakra-ui/react"
import React, { useState } from "react"

import PlayerCount from "./PlayerCount";
import PlayerCard from "./PlayerCard"
import { useQueryClient } from "react-query";


interface PlayerCardsProps {
  rollType: string
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
            <DrawerHeader>Players</DrawerHeader>
            <DrawerBody>
              <Wrap spacing="5px" align="center" m="5px" justify="center">
                {players?.map((player) =>
                  <WrapItem key={player} >
                    <PlayerCard id={player} rollType={props.rollType} profilePage={false}/>
                  </WrapItem>)}
                <WrapItem>
                </WrapItem>
              </Wrap>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    )
  }

}

export default PlayerCards