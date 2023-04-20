import { useState } from "react"
import { RollType } from "../../types/Group.enum"
import PlayerCard from "./PlayerCard"
import { Box, Button, Center } from "@chakra-ui/react"

export const NewPlayerCard = (props: { rollType: RollType, groupId: string }) => {

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