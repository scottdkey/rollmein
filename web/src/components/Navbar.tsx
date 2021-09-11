import { Box, Button, Circle, Flex, FormLabel, Heading, HStack, Link, Menu, MenuButton, MenuItem, MenuList, Switch, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from "@chakra-ui/icons"
import React, { useState, useEffect } from 'react'
import NextLink from "next/link"
import { useOptionsQuery, useUpdateOptionsMutation } from '../generated/graphql';
import { deleteCookie } from '../utils/cookieHelpers';
import { useAuth } from '../providers/AuthProvider';
import { client } from '../lib/clients/graphqlRequestClient';
import { useQueryClient } from "react-query"

interface NavBarProps {

}

const NavBar: React.FC<NavBarProps> = ({ }) => {
  const queryClient = useQueryClient()
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [optionsOpen, setOptionsOpen] = useState(false)
  const { mutateAsync } = useUpdateOptionsMutation(client, {
    onSuccess: (_, _variables, _context) => {
      queryClient.invalidateQueries("Options")
    }

  })
  const [theme, setTheme] = useState("dark")
  const [rollType, setRollType] = useState('ffa')
  const [lockAfterOut, setLockAfterOut] = useState(false)
  const { colorMode, setColorMode } = useColorMode()
  const { data, isFetched } = useOptionsQuery(client)


  const { auth, setAuth, user } = useAuth()
  const textColor = useColorModeValue("gray.800", "gray.300")

  useEffect(() => {
    if (colorMode !== theme) {
      setColorMode(theme)
    }
  }, [theme, colorMode, setColorMode])

  useEffect(() => {
    if (isFetched && data?.options) {
      const res = data.options
      if (res.theme !== theme) {
        setTheme(res.theme)
      }
      if (res.lockAfterOut !== lockAfterOut) {
        setLockAfterOut(res.lockAfterOut)
      }
      if (res.rollType !== rollType) {
        setRollType(res.rollType)
      }
    }

  }, [data, lockAfterOut, rollType, theme, isFetched])




  const OptionsMenu = () => {
    return (
      <Menu isOpen={optionsOpen}>
        <MenuButton textColor={textColor} mr={2} onClick={() => { setOptionsOpen(!optionsOpen) }}>
          options
        </MenuButton>
        <MenuList>
          <MenuItem>
            <Button
              onClick={async (e) => {
                e.preventDefault()
                const rollSwitch = rollType === "ffa" ? "role" : "ffa"
                setRollType(rollSwitch)
                await mutateAsync({ input: { lockAfterOut, rollType: "ffa", theme } }).then(data => {
                  if (data.updateOptions) {
                    setRollType(data.updateOptions.rollType)
                  }
                })
              }}
              colorScheme="teal" variant={data?.options?.rollType === "ffa" ? "solid" : "outline"}>
              Free For All
            </Button>
            <Button
              onClick={async (e) => {
                const rollSwitch = rollType === "ffa" ? "role" : "ffa"
                setRollType(rollSwitch)
                e.preventDefault()
                await mutateAsync({ input: { lockAfterOut, rollType: "role", theme } }).then(data => {
                  if (data.updateOptions) {
                    setRollType(data.updateOptions.rollType)
                  }
                })
              }}
              colorScheme="teal"
              variant={rollType === "role" ? "solid" : "outline"}>
              By Role
            </Button>
          </MenuItem>
          <MenuItem>
            <FormLabel htmlFor="lock" mb="0">
              Lock after Out?
            </FormLabel>
            <Switch isChecked={lockAfterOut} colorScheme="teal" id="lock" onChange={async (e) => {
              e.preventDefault()
              await mutateAsync({ input: { lockAfterOut: !lockAfterOut, rollType, theme } }).then(data => {
                if (data.updateOptions) {

                  setLockAfterOut(data.updateOptions.lockAfterOut)
                }
              })
            }} />
          </MenuItem>
          <MenuItem onClick={async (e) => {
            const themeOption = theme === "dark" ? "light" : "dark"
            e.preventDefault()
            await mutateAsync({ input: { lockAfterOut, rollType, theme: themeOption } }).then(data => {
              if (data.updateOptions) {
                setTheme(data.updateOptions.theme)
              }
            })
          }}>
            <Flex align="center">
              <Circle size="40px" bg="tomato" color="white">
                {colorMode === "light" ? <SunIcon /> : <MoonIcon />}
              </Circle>
            </Flex>

          </MenuItem>
        </MenuList>

      </Menu >
    )
  }

  let body = null
  
  if (logoutLoading && !auth) {
    <>
      Loading
    </>
  } else if (!auth) {
    body = (
      <>
        <NextLink href="/login">
          <Link textColor={textColor} mr={2}>login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link textColor={textColor}>register</Link>
        </NextLink>
      </>
    )
  } else {
    body = (
      <HStack>
        <Box mr={2} textColor={textColor} alignContent="center">{user?.username}</Box>
        <Button textColor={textColor} mr={2} onClick={async () => {
          deleteCookie()
          setAuth(false)
        }} variant="link" isLoading={logoutLoading}>logout</Button>
        <OptionsMenu />
      </HStack>
    )

  }
  const headerBgColor = useColorModeValue("teal.600", "teal.800")
  return (
    <Flex w="100%" zIndex="modal" bg={headerBgColor} p={4} >
      <Heading textColor={textColor} size="md" ml="15">Rollmein</Heading>
      <Box ml={'auto'}>
        {body}
      </Box>
    </Flex>);
}



export default NavBar

