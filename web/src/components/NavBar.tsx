import { Box, Button, Circle, Flex, FormLabel, Link, Menu, MenuButton, MenuItem, MenuList, Stack, Switch, useColorMode } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from "@chakra-ui/icons"
import React, { useState, useEffect, useContext } from 'react'
import NextLink from "next/link"
import { MeQuery, useMeQuery, useOptionsQuery, useUpdateOptionsMutation } from '../generated/graphql';
import { deleteCookie } from '../utils/cookieHelpers';
import { AuthContext } from '../providers/AuthProvider';
import { client } from '../lib/clients/graphqlRequestClient';
import { useIsAuth } from '../utils/useIsAuth';
interface NavBarProps {

}

const NavBar: React.FC<NavBarProps> = ({ }) => {
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [optionsOpen, setOptionsOpen] = useState(false)
  const { mutate } = useUpdateOptionsMutation(client, {
    onSuccess: (data) => {
      if (data.updateOptions) {
        setOptions(data.updateOptions)
      }

    }
  })
  const { colorMode, toggleColorMode, setColorMode } = useColorMode()
  const optionsQuery = useOptionsQuery(client)

  const { auth, setAuth, options, setOptions } = useContext(AuthContext)
  const meQuery = useMeQuery<MeQuery, Error>(client);

  useEffect(() => {
    if (colorMode !== options.theme) {
      setColorMode(options.theme)
    }
  }, [options])

  useEffect(() => {
    if (optionsQuery.isFetched && optionsQuery.data?.options) {
      setOptions(optionsQuery.data?.options)
    }
  }, [optionsQuery.isFetched])


  const OptionsMenu = () => {
    return (
      <Menu isOpen={optionsOpen}>
        <MenuButton mr={2} onClick={() => { setOptionsOpen(!optionsOpen) }} >
          options
        </MenuButton>
        <MenuList>

          <Stack direction="row" spacing={4} align="center">
            <Button onClick={() => mutate({ input: { ...options, rollType: "ffa" } })} colorScheme="teal" variant={options.rollType === "ffa" ? "solid" : "outline"}>
              Free For All
            </Button>
            <Button onClick={() => mutate({ input: { ...options, rollType: "role" } })} colorScheme="teal" variant={options.rollType === "role" ? "solid" : "outline"}>
              By Role
            </Button>
          </Stack>
          <MenuItem>
            <FormLabel htmlFor="lock" mb="0">
              Lock after Out?
            </FormLabel>
            <Switch colorScheme="teal" id="lock" />
          </MenuItem>
          <MenuItem onClick={() => toggleColorMode()}>
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
  if (meQuery.isLoading) {
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
        <Box mr={2} alignContent="center">{meQuery.data?.me?.username}</Box>
        <Button mr={2} onClick={async () => {
          deleteCookie()
          setLogoutLoading(true)
          setAuth(false)
        }} variant="link" isLoading={logoutLoading}>logout</Button>
        <OptionsMenu />
      </Flex>
    )

  }
  return (
    <Flex position="sticky" zIndex={2} bg="tan" p={4} >
      <Box ml={'auto'}>
        {body}
      </Box>
    </Flex>);
}



export default NavBar
