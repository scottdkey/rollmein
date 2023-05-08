import { HStack, VStack, FormLabel } from "@chakra-ui/react"
import { FC } from "react"
import { RollPlayerDisplay } from "./RollPlayerDisplay"

export const RollPlayers: FC<{ roll: IRoll }> = ({ roll }) => {
  if (roll.tank && roll.healer && roll.dps) {
    return (
      <HStack>
        <VStack>
          <FormLabel>Tank</FormLabel>
          <RollPlayerDisplay playerId={roll.tank} />
        </VStack>
        <VStack>
          <FormLabel>Healer</FormLabel>
          <RollPlayerDisplay playerId={roll.healer} />
        </VStack>
        <VStack>
          <FormLabel>Dps</FormLabel>
          {
            roll.dps.map(id => RollPlayerDisplay({ playerId: id }))
          }
        </VStack>
      </HStack>
    )
  }
  return null
}