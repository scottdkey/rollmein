import { Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Spinner, useDisclosure, Wrap, WrapItem, } from "@chakra-ui/react"
import React, { useEffect, useLayoutEffect, useState } from "react"

import { client } from "../lib/clients/graphqlRequestClient";
import NewPlayerCard from "./NewPlayerCard";
import dynamic from "next/dynamic";
import PlayerCount from "./PlayerCount";
import { useQueryClient } from "react-query";
import { useAuth } from "../providers/AuthProvider";


const PlayerCards: React.FC = (): JSX.Element => {
  const queryClient = useQueryClient()
  const { auth } = useAuth()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const PlayerCard = dynamic(() => import('./PlayerCard'))
  const [players, setPlayers] = useState<number[] | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState({})



  const deletePlayer = (id: number) => {
    if (players) {
      const newPlayers = players.filter(p => {
        if (p !== id) {
          return p
        }

      })
      setPlayers(newPlayers)
    }


    queryClient.invalidateQueries("Players")
  }


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
                    <PlayerCard playerId={player} deletePlayer={deletePlayer} />
                  </WrapItem>)}
                <WrapItem>
                  <NewPlayerCard />
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