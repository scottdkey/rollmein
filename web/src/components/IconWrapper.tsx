import { Button, Icon } from "@chakra-ui/react"
import { useColorModeValue } from "@chakra-ui/system"
import React from "react"


export interface IconWrapperType {
  Icon: typeof Icon
  onClick: Function
  selected: boolean
  color?: string
  disableHover?: boolean
}

export const IconWrapper: React.FC<IconWrapperType> = ({ Icon, onClick, selected, color = "teal", disableHover = false }): JSX.Element => {
  const primary = useColorModeValue(`${color}.500`, `${color}.800`)
  const secondary = useColorModeValue(`${color}.700`, `${color}.600`)
  const secondaryHover = useColorModeValue(`${color}.500`, `${color}.800`)
  const secondaryDisabled = useColorModeValue("gray.500", "gray.500")
  const secondaryDiabledHover = useColorModeValue("gray.400", "gray.300")

  const selectedHoverColor = selected ? secondaryHover : secondaryDiabledHover
  const selectedSecondaryColor = selected ? secondary : secondaryDisabled

  const hoverColorWithDisabled = disableHover ? selectedSecondaryColor : selectedHoverColor

  return (
    <Button
      colorScheme={color}
      outline="none"
      shadow="none"
      _focus={{
        outline: "none"
      }}
      background={selected ? primary : "none"}
      variant={selected ? "solid" : "ghost"}
      w="10" h="10" onClick={() => {
        onClick()
      }}>
      <Icon w={8} h={8} color={selectedSecondaryColor} _hover={{
        color: hoverColorWithDisabled
      }} />
    </Button >
  )
}