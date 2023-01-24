import { FC } from "react"
import { Circle, Flex, Icon, useColorModeValue } from "@chakra-ui/react"

type CountItemType = {
  count?: number
  icon: typeof Icon
  color: string
}

export const CountItem: FC<CountItemType> = ({ count = 0, icon, color }: CountItemType): JSX.Element => {
  const themeColor = useColorModeValue(`${color}.500`, `${color}.600`)
  const glowColor = useColorModeValue("#FFFFFF", `#000000`)
  return (
    <Flex justify="center" align="center" >
      <Circle fontSize="xl" position="absolute" zIndex="1" textShadow={`0 0 3px ${glowColor}, 0 0 5px ${glowColor}`}>{count}</Circle>
      <Icon as={icon} color={themeColor} opacity="70%" w="10" h="10" />
    </Flex>
  )
}