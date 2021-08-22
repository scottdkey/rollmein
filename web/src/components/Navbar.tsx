import { Box, Button, Circle, Flex, FormLabel, Link, Menu, MenuButton, MenuItem, MenuList, Spinner, Stack, Switch, useColorMode } from '@chakra-ui/react';
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
    onSuccess: (data, _variables, _context) => {
      queryClient.invalidateQueries("Options")
    }

  })
  const [theme, setTheme] = useState("dark")
  const [rollType, setRollType] = useState('ffa')
  const [lockAfterOut, setLockAfterOut] = useState(false)
  const { colorMode, setColorMode } = useColorMode()
  const { data, isFetched, isStale } = useOptionsQuery(client)


  const { auth, setAuth, user } = useAuth()


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
        <MenuButton mr={2} onClick={() => { setOptionsOpen(!optionsOpen) }} >
          options
        </MenuButton>
        <MenuList>
          <Stack direction="row" spacing={4} align="center">
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
          </Stack>
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
            <Flex alignItems="center">
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
          <Link mr={2}>login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link >register</Link>
        </NextLink>
      </>
    )
  } else {
    body = (
      <Flex>
        <Box mr={2} alignContent="center">{user?.username}</Box>
        <Button mr={2} onClick={async () => {
          deleteCookie()
          setAuth(false)
        }} variant="link" isLoading={logoutLoading}>logout</Button>
        <OptionsMenu />
      </Flex>
    )

  }
  return (
    <Flex w="100%" zIndex={2} bg="teal.800" p={4} >
      <Box ml={'auto'}>
        {body}
      </Box>
    </Flex>);
}



export default NavBar
