import { Box, Circle, Flex, Heading, HStack, Square, useColorMode, useColorModeValue, VStack } from '@chakra-ui/react';
import { SunIcon, MoonIcon, ChevronDownIcon } from "@chakra-ui/icons"
import React, { useState, useEffect } from 'react'
import NextLink from "next/link";
import AuthMenu from './AuthMenu';
import styles from "../styles/Navbar.module.scss"
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

interface NavBarProps {

}

const NavBar: React.FC<NavBarProps> = ({ }) => {
  const [theme, setTheme] = useState("dark")
  const {data: session, status} = useSession()
  const { colorMode, setColorMode } = useColorMode()
  const [currentRoute, setCurrentRoute] = useState("")
  const themeButtonColor = useColorModeValue("orange.600", "orange.400")
  const router = useRouter()

  const textColor = useColorModeValue("gray.800", "gray.300")
  const toggleColorMode = () => {
    const changeTo = colorMode === 'dark' ? 'light' : 'dark'
    setTheme(changeTo)
    setColorMode(changeTo)
  }

  const routerClassNameSwitch = (routePaths: string[]) => {
    let pathStyle = styles.InactiveItem
    routePaths.forEach(path => {
      if (path === currentRoute) {
        pathStyle = styles.ActiveItem
      }
    })
    return pathStyle
  }

  useEffect(() => {
    if (colorMode !== theme) {
      setColorMode(theme)
    }
    setCurrentRoute(router.asPath)
  }, [theme, colorMode, setColorMode, router.asPath])

  const headerBgColor = useColorModeValue("teal.600", "teal.800")
  return (
    <Box bg={headerBgColor}>
      <HStack ml={'2em'} mr={'2em'}>
        <VStack mr={'auto'}>
          <Heading className={styles.SiteHeader}>Roll Me In</Heading>
          <HStack>
            <NextLink href={'/'}><div className={routerClassNameSwitch(["/", '/#'])}>Home</div></NextLink>
            {status === "authenticated" ? <NextLink href={'/profile'}>
              <div className={routerClassNameSwitch(["/profile"])}>Profile</div></NextLink> : null}
          </HStack>
        </VStack>
        <Box ml={'auto'}>
          <HStack>
            <AuthMenu />
            <Square
              backgroundColor={themeButtonColor}
              className={styles.ThemeToggleButton} size="40px"
              onClick={toggleColorMode}>
              {colorMode === 'dark' ? <MoonIcon /> : <SunIcon />}
            </Square>
          </HStack>
        </Box>
      </HStack>
    </Box>
  );
}



export default NavBar

