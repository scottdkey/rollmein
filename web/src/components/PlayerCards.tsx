import { Box, Button, Center, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, HStack, Spinner, useDisclosure, Wrap, WrapItem, } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { PlayersQuery, usePlayersQuery } from "../generated/graphql";

import { client } from "../lib/clients/graphqlRequestClient";
import NewPlayerCard from "./NewPlayerCard";
import dynamic from "next/dynamic";
import { Sheild, Sword, FirstAid, Lock, Dice } from "../assets";
import { IconWrapper } from "./IconWrapper";
import PlayerCount from "./PlayerCount";
import { useQueryClient } from "react-query";


const PlayerCards: React.FC = (): JSX.Element => {
  const queryClient = useQueryClient()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { data, isLoading } = usePlayersQuery<PlayersQuery, Error>(client);
  const PlayerCard = dynamic(() => import('./PlayerCard'))
  const [players, setPlayers] = useState<number[] | undefined>()

  useEffect(() => {
    if (data?.players) {
      const returnArray = data.players.map(p => {
        return p.id
      })
      setPlayers(returnArray)
    }
  }, [data?.players])

  const deletePlayer = (id: number) => {
    const newPlayers = players?.filter(p => {
      p = id
    })
    setPlayers(newPlayers)
  }


  if (isLoading) {
    return <Box><Spinner /></Box>
  } else if (!isLoading && !data) {
    return <Box bg="red">Query Failed</Box>
  } else {
    return (
      <>
        <Button onClick={onOpen} padding="30px"
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