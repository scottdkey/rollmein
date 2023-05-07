import { HStack, VStack, FormLabel } from "@chakra-ui/react"
import { FC } from "react"
import { IRoll } from "../../stores/Roll.slice"
import { RollPlayerDisplay } from "./RollPlayerDisplay"

export const RollPlayers: FC<{ roll: IRoll }> = ({ roll }) => {
  if (roll.tank && roll.healer && roll.dps) {
    return (
      <HStack>
        <VStack>
          <FormLabel>Tank</FormLabel>
          <RollPlayerDisplay player={roll.tank} />
        </VStack>
        <VStack>
          <FormLabel>Healer</FormLabel>
          <RollPlayerDisplay player={roll.healer} />
        </VStack>
        <VStack>
          <FormLabel>Dps</FormLabel>
          {
            roll.dps.map(player => RollPlayerDisplay({ player }))
          }
        </VStack>
      </HStack>
    )
  }
  return null
}