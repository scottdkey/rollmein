import { HStack } from "@chakra-ui/react"
import { FC } from "react"
import { IRoll } from "../../stores/Roll.slice"
import { RollPlayerDisplay } from "./RollPlayerDisplay"

export const FfaRollPlayers: FC<{ roll: IRoll }> = ({ roll }) => {
  if (roll.ffa) {
    return (
      <HStack>
        {
          roll.ffa.map(player => RollPlayerDisplay({ player }))
        }
      </HStack>
    )
  }
  return null
}