import { HStack } from "@chakra-ui/react"
import { FC } from "react"
import { RollPlayerDisplay } from "./RollPlayerDisplay"

export const FfaRollPlayers: FC<{ roll: IRoll }> = ({ roll }) => {
  if (roll.ffa) {
    return (
      <HStack>{roll.ffa.map(id =>
        <RollPlayerDisplay key={id} playerId={id} />
      )}
      </HStack>
    )
  }
  return null
}