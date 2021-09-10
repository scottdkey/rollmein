import { Box } from "@chakra-ui/react"
import { useColorModeValue } from "@chakra-ui/system"
import React from "react"



interface CardWrapperType {
  locked: boolean
}
const CardWraper: React.FC<CardWrapperType> = ({ children, locked }): JSX.Element => {
  const primary = useColorModeValue(`gray.300`, `gray.600`)
  const lockedColor = useColorModeValue("yellow.100", "yellow.600")
  const background = locked ? lockedColor : primary
  return (
    <Box borderRadius={"md"} padding={2} w="200px" h="100%" shadow="base" borderWidth="1px" bg={background} position="relative" justifyContent="center" alignItems="center">{children}</Box>
  )
}

export default CardWraper