import React from "react"
import { Box, Button, Circle, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Input, Spinner, useDisclosure } from "@chakra-ui/react"
import { Layout } from "../components/Layout";
import { useAuth } from "../providers/AuthProvider";
import PlayerCards from "../components/PlayerCards";
import { FirstAid, Dice, Lock, Trash } from "../assets";


const Index = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()
  const { auth } = useAuth()

  return (
    <Layout>
      {
        !auth ?
          <Spinner />
          :
          <>
            <Button colorScheme="teal" onClick={onOpen}>
              {isOpen ? "Close" : "Open"}
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
                <DrawerHeader>Players</DrawerHeader>

                <DrawerBody>
                  <PlayerCards />
                </DrawerBody>

                <DrawerFooter>
                  footer
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </>
      }


    </Layout>
  )
}

export default Index;